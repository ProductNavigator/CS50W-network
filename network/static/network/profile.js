////////////////////////////////////////////////////////
function Post(props) {
    return (
    <div className="post_body">
        
        <div className="idclass">
        This is post number: {props.id}
        </div>

        <div className="userclass">
        Written by user: 
        <a href={`./profile/${props.user}`}>
        {props.user}
        </a>
        </div>
        
        <div className="textclass">
        {props.text}
        </div>

        <div className="timeclass">
        Time: {props.time}
        </div>     

        <div className="likesclass">
        likes: {props.likes}
        </div>  

    </div>

    )
}

////////////////////////////////////////
function App(prop) {
    //Create current list of posts
    const [PostArray, setPostArray] = React.useState([]);
    const [userweneed, setUser] = React.useState([]);

  //get profile 
      
  React.useEffect(() => {
    const profile = document.getElementById('user_name').innerHTML
    setUser(profile)
    }, [])

    console.log(userweneed)

    //By fetching data from API
    React.useEffect(() => {

    fetch('/api/Post/')
        .then(response => response.json())
        .then(posts => posts.sort((a, b) => a - b).reverse())
        .then(posts => {setPostArray(posts)})
    }, [])
    console.log(PostArray)

    //Create a list of components with this fetched data iside variable Listofposts
    const Listofposts = PostArray.filter(post => post.user === userweneed).map(post => (
    <Post key={post.id} id={post.id} user={post.user} text={post.text} time={post.time} likes={post.likes}/>
    ))

    //Render index page
    return (
    <div>
    {Listofposts}
    </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App/>)