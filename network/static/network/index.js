////////////////////////////////////////////////////////
//Creating default component (should be seperate js file)
function Post(props) {
    return (
    <div className="post_body">
        
        <div className="idclass">
        This is post number: {props.id}
        </div>

        <div className="userclass">
        Written by user: {props.user}
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

///create and pass crsf token
//var csrftoken = django.middleware.csrf.get_token()

//function CSRFToken(props) {
    //return (
    //<input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
    //);
//};

///////////////////////////////////////////////////////
//creating Add post option
//function AddPost (props) {
    //const token = "{% csrf_token %}"
    //return (
    //<div className="addpost">
        //<form action="" method ="post">  
        //<textarea name ="text" className="form-control" rows="3"></textarea>
        //<button type="submit" className="btn btn-primary">Add Post </button>
        //<div>{token}</div>
        //</form>
    //</div>  
    //)
//}
///////////////////////////////////////////////////////
//creating App for this view 

function App(prop) {
    //Create current list of posts
    const [PostArray, setPostArray] = React.useState([]);

    //By fetching data from API
    React.useEffect(() => {
    fetch('/api/Post/')
        .then(response => response.json())
        .then(posts => posts.sort((a, b) => a - b).reverse())
        .then(posts => {setPostArray(posts)})
    }, [])

    const sortDescending = () => {
        const sortDescPosts = [...PostArray]
        sortDescPosts.sort((a, b) => a - b).reverse()
        setPostArray( sortDescPosts )
    }

    //Consol log results of fetching 
    console.log(PostArray)

    //Create a list of components with this fetched data iside variable Listofposts
    const Listofposts = PostArray.map(post => (
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