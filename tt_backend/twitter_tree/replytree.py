import tweepy
import pygraphviz as pgv
import sys, os
import logging
import textwrap
import json
import io
import re
logging.basicConfig(level=logging.INFO)
# helper function to get the hex code of the plt colormap
# at a given index
def get_color(num):
    # colormap = [(0.984313725490196, 0.7058823529411765, 0.6823529411764706, 1.0),
    #     (0.7019607843137254, 0.803921568627451, 0.8901960784313725, 1.0),
    #     (0.8, 0.9215686274509803, 0.7725490196078432, 1.0),
    #     (0.8705882352941177, 0.796078431372549, 0.8941176470588236, 1.0),
    #     (0.996078431372549, 0.8509803921568627, 0.6509803921568628, 1.0),
    #     (1.0, 1.0, 0.8, 1.0),
    #     (0.8980392156862745, 0.8470588235294118, 0.7411764705882353, 1.0),
    #     (0.9921568627450981, 0.8549019607843137, 0.9254901960784314, 1.0),
    #     (0.9490196078431372, 0.9490196078431372, 0.9490196078431372, 1.0),
    # ]

    colormap = ["d3eaee","fff1e6","dfe7fd","f0efeb","eae4e9","e2ece9","fde2e4","cddafd","fad2e1"]
    idx = num % len(colormap)
    color = colormap[idx]
    if type(color) == str:
        if color[0] == "#":
            print("color found")
            return color
        else:
            return "#" + color
    else:
        return "#"+''.join([hex(int(c * 255))[2:] for c in color_tup[:-1]])

def extract_id(url):
    id_str = url
    id_str = id_str.split('?')[0]
    id_str = id_str.strip("/")
    id_str = id_str.split("/")[-1]
    return id_str

def strip_reply_handles(text):
    split_text = text.split(' ')
    index = 0
    for word in split_text:
        if word[0] == '@':
            index += 1
        else:
            break
    return ' '.join(split_text[index:])


class TweetBranch():
    """Contains a tweet object and a list of children branches.

    Running the find_children method populates the children list
    """
    def __init__(self, tweet):
        self.tweet = tweet
        self.name = tweet.user.screen_name
        self.id_str = tweet.id_str
        self.children = []

    def __str__(self):
        return '@'+self.name+':\n'+self.tweet.full_text

    def to_html(self, orig=False):
        header = '<<table border="0"><tr><td><b>&#64;'+self.name+'</b>'
        if orig:
            header += " &#9674;"
        header += "</td></tr><hr />"
        # html_result += "<br />".join(textwrap.wrap(self.tweet.full_text)).replace('\n', '<br />')+'>'
        stripped_text = strip_reply_handles(self.tweet.full_text)
        tweet_lines_raw = [textwrap.wrap(chunk) for chunk in stripped_text.split('\n')]
        
        tweet_lines = '<tr><td>'
        for line_group in tweet_lines_raw:
            if line_group == []:
                tweet_lines += "<br />"
                continue
            for line in line_group:
                tweet_lines += line + "<br />"
        tweet_lines = tweet_lines[:-6] + "</td></tr>"
        return header + tweet_lines + "</table>>"

    def update_children(self, replies):
        """takes in a list of reply tweets, and correctly
        populates the children list with Tweet Branch objects
        """
        list_of_ids = [t.tweet.id_str for t in self.children]
        for reply in replies:
            if reply.id_str not in list_of_ids:
                self.children.append(TweetBranch(reply))


class ReplyCache():
    def __init__(self, api):
        self.cache = {}
        self.api = api

    @classmethod
    def from_file(cls, filename, api):
        rc = cls(api)

        with open(filename, 'r') as f:
            data_from_file = json.load(f)

        cache = {}

        for key in data_from_file.keys():
            cache[key] = [ tweepy.Status().parse(None, tweet) for tweet in data_from_file[key] ]

        rc.cache = cache

        return rc

    def get_children(self,tweet):
        pass

    def populate_cache(self,tweet):
        if tweet.user.screen_name not in self.cache.keys():
            logging.info("Caching Tweets to User @"+tweet.user.screen_name+"...")
            self.cache[tweet.user.screen_name] = []

            for pot_child in tweepy.Cursor(self.api.search, q='to:'+tweet.user.screen_name, since_id=tweet.id_str, timeout=999999, tweet_mode='extended').items(1000):
                logging.debug("Caching tweet from @"+pot_child.user.screen_name+" —— "+pot_child.full_text[:40])
                if hasattr(pot_child, 'in_reply_to_status_id_str'):
                    self.cache[tweet.user.screen_name].append(pot_child)

            logging.info(f"Cached {len(self.cache[tweet.user.screen_name])} Tweets to User @"+tweet.user.screen_name)
        else:
            logging.info("Tweets to User @"+tweet.user.screen_name+" already in cache")

    def get_replies(self, tweet):
        self.populate_cache(tweet)

        replies = []
        tweets_to_check = self.cache[tweet.user.screen_name]
        logging.info("Checking tweets in cache to user @"+tweet.user.screen_name)
        if len(tweets_to_check) > 0:
            for pot_child in self.cache[tweet.user.screen_name]:
                if pot_child.in_reply_to_status_id_str == tweet.id_str:
                    replies.append(pot_child)

        return replies

    def save_to_file(self, filename):
        def encode_status(z):
            return z._json
        with open(filename, "w") as f:
            json.dump(self.cache, f, default=encode_status)



class ReplyTree():
    def __init__(self, origin_id, savedir=''):
        auth = self.auth_config()
        api = tweepy.API(auth, wait_on_rate_limit=True,
            wait_on_rate_limit_notify=True)

        try:
            api.verify_credentials()
            logging.info("AUTHENTICATION OK")
        except:
            logging.error("ERROR DURING AUTHENTICATION")
            raise RuntimeError("Authentication Error.")

        try:
            self.origin = TweetBranch(api.get_status(origin_id, tweet_mode='extended'))
        except tweepy.error.TweepError as e:
            raise RuntimeError("Tweet with corresponding origin_id not found.")

        self.reply_cache = ReplyCache(api)

        self.graph = pgv.AGraph(directed=True, bgcolor="#F3EFF6")
        self.colors = {}

        self.savedir = savedir
        if self.savedir:
            self.savedir = self.savedir.rstrip("/")
            self.savedir += '/'
            if not os.path.isdir(self.savedir):
                os.makedirs(self.savedir)

        self.is_populated = False

        self.number_of_nodes = 1

    def auth_config(self):
        consumer_key = os.getenv("CONSUMER_KEY")
        consumer_secret = os.getenv("CONSUMER_SECRET")
        access_token = os.getenv("ACCESS_TOKEN")
        access_token_secret = os.getenv("ACCESS_TOKEN_SECRET")

        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)

        return auth

    def populate_replies_of_node(self, node):
        """takes in a patricular node, and populates its children using the
        cache object
        """
        repls = self.reply_cache.get_replies(node.tweet)
        node.update_children(repls)

    def pop_tree_recursive(self, node):
        # populate children list
        self.populate_replies_of_node(node)

        if node.name not in self.colors.keys():
            self.colors[node.name] = get_color(len(self.colors.keys()))

        if len(node.children) > 0:
            for c in node.children:
                self.number_of_nodes += 1
                self.pop_tree_recursive(c)

    def populate_tree(self):
        
        if not self.is_populated:
            self.pop_tree_recursive(self.origin)
            logging.info(f"Tree populated with {self.number_of_nodes} nodes.")

            self.add_node_to_graph(self.origin)
            self.draw_tree_recursive(self.origin)

            self.is_populated = True

    def add_node_to_graph(self, node):
        if not self.graph.has_node(node.id_str):
            self.graph.add_node(node.id_str)
            n = self.graph.get_node(node.id_str)
            orig = (node.name == self.origin.name)
            n.attr['label'] = node.to_html(orig=orig)
            n.attr['shape'] = 'rect'
            n.attr['style'] = 'filled, rounded'
            n.attr['fillcolor'] = self.colors[node.name]

    def add_edge_to_graph(self, node1, node2):
        if not self.graph.has_edge(node1.id_str, node2.id_str):
            self.graph.add_edge(node1.id_str, node2.id_str)
            e = self.graph.get_edge(node1.id_str, node2.id_str)

    def draw_tree_recursive(self, node):
        if len(node.children) > 0:
            for c in node.children:
                self.add_node_to_graph(c)
                self.add_edge_to_graph(node, c)
                self.draw_tree_recursive(c)

    def save(self):
        self.graph.write(self.savedir + self.origin.id_str + "_tree.dot")
        #self.reply_cache.save_to_file(self.savedir + self.origin.id_str + "_cache.json")

    def draw_tree(self):
        self.graph.draw(self.savedir + self.origin.id_str + "_tree.svg", prog='dot')

        return self.savedir + self.origin.id_str + "_tree.svg"

    def get_dot(self):
        return self.graph.to_string()

    def get_svg(self):
        reader = io.BytesIO()
        self.graph.draw(reader, format="svg", prog='dot')
        raw_svg = reader.getvalue().decode()

        # make the tweet-bubbles clickable (hopefully)
        # add in links (username links to profile, tweet body links to status)
        username_blocks = [(m.start(), m.end()) for m in re.finditer('<text .*>@.*</text>', raw_svg)]
        id_blocks = [(m.start()+5, m.end()-4) for m in re.finditer('<!-- [0-9]* -->', raw_svg)]
        text_blocks = [(m.start(), m.end()-9) for m in re.finditer('<text (.|\n)*?<polygon', raw_svg)]

        user_linked_svg = ""
        last_index = 0
        for (u_start,u_end), (i_start,i_end), (t_start,t_end) in zip(username_blocks, id_blocks, text_blocks):
            # locate the actual username in the username block
            m = re.search('@.*</', raw_svg[u_start:u_end])
            uname = raw_svg[u_start:u_end][m.start()+1:m.end()-2]

            # get id
            tweet_id = raw_svg[i_start:i_end]

            # add in the links to the raw svg
            # link username to profile
            user_linked_svg += raw_svg[last_index:u_start] + f'<a href="https://twitter.com/{uname}" target="_blank" rel="noopener noreferrer">'
            user_linked_svg += raw_svg[u_start:u_end] + '</a>'

            # link text to tweet
            user_linked_svg += f'<a href="https://twitter.com/{uname}/status/{tweet_id}" target="_blank" rel="noopener noreferrer">'
            user_linked_svg += raw_svg[u_end:t_end] + '</a>'

            last_index = t_end

        user_linked_svg += raw_svg[last_index:]

        return user_linked_svg

