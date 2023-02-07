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
    const [FollowsArray, setFollowsArray] = React.useState([]);
    const [User, setUser] = React.useState([]);

    React.useEffect(() => {
        const profile = document.getElementById('user_name').innerHTML
        setUser(profile)
        }, [])
    console.log(User)

  //get follows arrey
    React.useEffect(() => {

    fetch('/api/Follows/')
        .then(response=> response.json())
        .then(followers => setFollowsArray(followers))
        .catch(error => {console.log(error)})
    }, [])
    console.log(FollowsArray)

    
    //trim get follows arrey with only follows relevant to current user
    const test = FollowsArray.filter(follower => follower.person == User);
    console.log(test);
    const PeopleIFollow =[]
    const testlist2 = test.map(obj => (PeopleIFollow.push(obj.follows)))
    console.log(PeopleIFollow);
    PeopleIFollow instanceof Object;

    
    //By fetching data from API get Posts
    React.useEffect(() => {
    fetch('/api/Post/')
        .then(response => response.json())
        .then(posts => posts.sort((a, b) => a - b).reverse())
        .then(posts => setPostArray(posts))
        .catch(error => {console.log(error)})
    }, [])
    console.log(PostArray)


    //// Create a funtion to compare all posts and list of followed people (testlist)
    function MapPostsAndFollows(post) {
        let counter = 0
        for (let i = 0; i < PeopleIFollow.length; i++) {
            if(post.user == PeopleIFollow[i]) {
            counter++}
          }
        if (counter > 0) {
            return true;}
        else {return false}
    }

    const Listofposts = PostArray.filter(MapPostsAndFollows).map(post => (
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