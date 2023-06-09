import Link from "next/link";
import FeedPost from "@/components/Feed/feedPost";
import FeedFriend from "@/components/Feed/feedFriend";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "@/context/userContext";
import LeftPanelNavigation from "@/components/UI/leftPanelNavigation";

function Feed() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false); // Loading state variable
  const [friends, setFriends] = useState();
  const [posts, setPosts] = useState();
  const [page, setPage] = useState(1);
  const [post, setPost] = useState({
    content: "",
    imageBase64: "",
  });

  useEffect(() => {
    async function verifySession() {
      const token = await fetch("/api/verifySession");
      const data = await token.json();
      if (!data) {
        router.push({
          pathname: "/signin",
          query: { from: router.asPath },
        });
      }
    }

    async function FetchFriends() {
      const res = await fetch("/api/fetchFriends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerId: user?.id,
        }),
      });
      const data = await res.json();
      setFriends(data);
    }

    async function FetchPosts() {
      const res = await fetch("/api/fetchPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page,
        }),
      });
      const data = await res.json();
      setPosts(data);
    }
    verifySession();
    if (user) {
      FetchPosts();
      FetchFriends();
    }
  }, [user, page, router, loading]);

  async function handleImageUpload(e) {
    const reader = new FileReader();
    const currentFile = e.target.files?.[0];
    if (currentFile) {
      reader.readAsDataURL(currentFile);
    }
    reader.onloadend = async () => {
      console.log(reader.result);
      setPost({ ...post, imageBase64: reader.result });
    };
  }
  async function submitPost(e) {
    e.preventDefault();
    setLoading(true); // Start loading animation

    try {
      const result = await fetch("/api/createBandPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...post,
          bandDataId: user.bandDataId,
          type: "INDIVIDUAL",
          userID: user.id,
        }),
      });

      // Handle the response from the server
    } catch (error) {
      // Handle the error
    } finally {
      setLoading(false); // Stop loading animation
    }
  }

  console.log(posts);
  return (
    <>
      {user ? (
        <div id="container">
          <LeftPanelNavigation />
          <div id="middle">
            <div id="middle_wrapper">
              <div id="middle_wrapper_header">
                <h1>Feed</h1>
              </div>
              <form id="post_action">
                <div id="post_action_compose_new">
                  <textarea
                    id="compose_new_textarea"
                    placeholder="Compose new post"
                    value={post.content}
                    onChange={(e) =>
                      setPost({ ...post, content: e.currentTarget.value })
                    }
                  ></textarea>
                </div>
                <div id="post_action_add_buttons">
                  <label
                    htmlFor="add_photo"
                    id="add_photo_label"
                    className="file-input-label"
                  >
                    Choose File
                    <input
                      id="add_photo"
                      type="file"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <button id="add_video">Add Video</button>
                  <button id="post" onClick={submitPost}>
                    Post
                  </button>
                </div>
              </form>
              {loading && <div className="loading-animation">Loading...</div>}{" "}
              <div id="content_wrapper">
                <div id="content_display">
                  {posts &&
                    posts.map((currentPost) => {
                      const date = currentPost.createdAt.split("T")[0]; // Extract the date portion

                      return (
                        <FeedPost
                          type={currentPost.type}
                          image={currentPost.image}
                          content={currentPost.content}
                          date={date} // Pass the extracted date
                          userdata={currentPost.UserData}
                        />
                      );
                    })}
                </div>
              </div>
              <button
                id="load_more_posts"
                onClick={() => {
                  setPage((prev) => prev + 1);
                }}
              >
                Load More
              </button>
            </div>
          </div>
          <div id="right">
            <div id="right_wrapper">
              <div id="right_wrapper_header">
                <input
                  id="right_wrapper_header_search_bar"
                  placeholder="Search friends or bands..."
                />
              </div>

              <div id="band_wrapper">
                <h1>Your Band's Latest Posts</h1>
                <div id="band_wrapper_latest_post"></div>
              </div>
              <div id="friends_wrapper">
                <h1>Friends</h1>
                {friends &&
                  friends.map((friend) => (
                    <FeedFriend
                      id={friend.following.id}
                      name={friend.following.username}
                      imageURL={friend.following.image}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* Display loading animation when loading is true */}
    </>
  );
}

export default Feed;
