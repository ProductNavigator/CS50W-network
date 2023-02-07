////////////////////////////////////////////////////////
//Creating default component (should be seperate js file)
function App(prop) {
    //Create current list of posts
    const [PostArray, setPostArray] = React.useState([]);
    const [CurrentUser, setCurrentUser] = React.useState('');

    //By fetching data from API
    React.useEffect(() => {
    fetch('/api/Post/' , {
        credentials: 'same-origin',
        credentials : 'include',})
        .then(response => response.json())
        .then(posts => posts.sort((a, b) => a - b).reverse())
        .then(posts => {setPostArray(posts)})

    //fetch current user
    fetch('/current_user', {
        method: 'GET'})
    .then(response => response.json())
    .then(res => {setCurrentUser(res.username)})
    .then(response => console.log(CurrentUser))
    }, [])

    const sortDescending = () => {
        const sortDescPosts = [...PostArray]
        sortDescPosts.sort((a, b) => a - b).reverse()
        setPostArray( sortDescPosts )
    }

    //Consol log results of fetching 
    console.log(PostArray)
    console.log(CurrentUser)
    
    
    ///#####POST COMPNENT#####/////
    function Post(props) {
        const [PostData, setPostData] = React.useState(props);
        const [Disable, setDisable] = React.useState(true);
        const [Edit, setEdit] = React.useState(false);
        const [EditingProcess, setEditingProcess] = React.useState(true);
        
        //Check if this is my post, if so render edit button:
        React.useEffect(() => {
            if(props.activeuser === props.user){
                setEdit(false)
                }
                else{
                    setEdit(true)
                }
        }, [])


        //Function to edit Post
        function EditPost(text) {
            console.log(text)
            let newvalue = !EditingProcess
            setEditingProcess(newvalue)
            if(EditingProcess === false){
                setPostData({
                    ...PostData,
                    text: text
                });
                //fetch(`/api/Post/${PostData.id}` , {
                //credentials: 'same-origin',
                //credentials : 'include',})
                //.then(response => response.json())
                //.then(response => console.log(response))
                //.then(response => setPostData(response))
                //.then(response => console.log(PostData))
                }
        }

        //handler to call EditPost function 

        const handleEditPost = (text) => {EditPost(text)};

        ////####FORM COMPONENT to edit////###3
        function EditForm(post){
            const [PostEdited, setPostEdited] = React.useState(post.props);
            const [Editing, setEditing] = React.useState('');
            const [PostData, setPostData] = React.useState({PostData});
            
            //check passed data to the component
            console.log(PostEdited)

            function handleChange(event) {
                setPostEdited(prevPost => {
                        return {
                        ...prevPost,
                        [event.target.name] : event.target.value}
                        
                    })
              }

            //posting change
            function handleSubmit(event) {
                event.preventDefault();
                console.log(PostEdited.text);
                
                fetch(`edit/editpost/${PostEdited.id}`, {
                    credentials: 'same-origin',
                    credentials : 'include',
                    headers: { 'Content-Type': 'text/plain; charset=UTF-8'
                            },  
                    method: 'POST',
                    body: PostEdited.text,
                    })
                    .then(res => {
                        console.log(res.status);
                        console.log(res.headers);
                        setPostData(res);
                        return(res)
                    })
                    .then( 
                        (result) => {
                            console.log(result);
                            setPostData(result)},
                        (error) => {
                            console.log(error);
                        },
                    )
                    .then(handleEditPost(PostEdited.text))
              }

            //visiable form component
            return(
            <form onSubmit={handleSubmit}>
                <textarea name="text" value={PostEdited.text} onChange={handleChange} />
                <br></br>
                <button>Submit Change</button>
            </form>
            ) 
        }

        //Funtrion to handle addink likes
        function Addlike(post) {
            console.log(post);
            setPostData(post)
            console.log(PostData);

            //get crfs token
            function getCookie(name) {
                let cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    const cookies = document.cookie.split(';');
                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i].trim();
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
            const csrftoken = getCookie('csrftoken');
            console.log(csrftoken)
            
            //sent PUT request
            fetch(`/likes/${post.id}`, {
                credentials: 'same-origin',
                credentials : 'include',
                headers: { 'Content-Type': 'text/plain',
                        },  
                method: 'POST',
                body: Disable,
                })
                .then(res => {
                    console.log(res.status);
                    console.log(res.headers);
                    setPostData(res);
                    return(res)
                })
                .then( 
                    (result) => {
                        console.log(result);
                        setPostData(result)},
                    (error) => {
                        console.log(error);
                    },
                )
                .then(
                    fetch(`/api/Post/${post.id}`, {
                        credentials: 'same-origin',
                        credentials : 'include',})
                        .then(response => response.json())
                        .then(res => setPostData(res))
                )
            //update text on the button
            setDisable(!Disable);
        }
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
            
            <div className="textclass" name="text">
            {EditingProcess ? `${PostData.text}` : <EditForm props={props} handleEditPost={handleEditPost} PostData={PostData}/>}
            </div>
    
            <div className="timeclass">
            Time: {props.time}
            </div>     
    
            <div className="likesclass">
            likes: {PostData.likes}
            </div>
            <br></br>

            <button type="button" onClick={() => Addlike(props)} className={Disable ? "btn btn-success" : "btn btn-danger"} >{Disable ? "I like" : "No, I don't like"}</button>
            <p></p>
            <button type="button" hidden={Edit} onClick={() => EditPost()}className="btn btn-info">Edit Post</button> 
        </div>
    
        )
    }
    //Create a list of components with this fetched data iside variable Listofposts
    const Listofposts = PostArray.map(post => (
    <Post key={post.id} id={post.id} user={post.user} text={post.text} time={post.time} likes={post.likes} activeuser={CurrentUser}/>
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