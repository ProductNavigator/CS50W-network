////////////////////////////////////////////////////////
//Creating default component (should be seperate js file)
function App(prop) {
    //Create current list of posts
    const [PostArray, setPostArray] = React.useState([]);
    const [CurrentUser, setCurrentUser] = React.useState('');
    const [ThisPagePosts, setThisPagePosts] = React.useState(currentPosts);
    


    /// get user and all post and filter all post with the user

    React.useEffect(() => {
    //By fetching data from API
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


            //handle enter click as submit 
            function handleKeyDown(event){
                if (event.key === 'Enter'){
                    return handleSubmit(event)
                    
                }

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
                <textarea className="inputedit" name="text" value={PostEdited.text} onChange={handleChange} onKeyDown={handleKeyDown}/>
                <br></br>
                <button className="btn btn-primary">Save</button>
                <p></p>
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
    

    

  
        //########Pagination code:

        //Pagination states
        const [currentPage, setCurrentPage] = React.useState(1);
        const [postsPerPage] = React.useState(10)
        
            const indexOfLastPost = currentPage * postsPerPage;
            const indexOfFirstPost = indexOfLastPost - postsPerPage;
            const currentPosts = PostArray.filter(post => post.user === CurrentUser).slice(indexOfFirstPost, indexOfLastPost);
            console.log(indexOfLastPost)
            console.log(indexOfFirstPost)
            console.log(currentPosts)
            console.log(ThisPagePosts)

    //Create a list of components with this fetched data iside variable Listofposts



            const paginate = (pageNumber) => {
                setCurrentPage(pageNumber);
             };
            
             const previousPage = () => {
                if (currentPage !== 1) {
                   setCurrentPage(currentPage - 1);
                }
             };
           
             const nextPage = () => {
                if (currentPage !== Math.ceil(currentPosts.length / postsPerPage)) {
                   setCurrentPage(currentPage + 1);
                }
                console.log(indexOfLastPost)
             };
           
            
        //###Paginate component
            function Paginate (props) {
                console.log(props.postsPerPage)
                console.log(props.totalPosts)

                const pageNumbers = []
              
                for (let i = 1; i <= Math.ceil(props.totalPosts / props.postsPerPage); i++) {
                   pageNumbers.push(i);
                }
                console.log(pageNumbers)
                
                return (
                    <div className="btn-group" role="group">
                       <ul className="pagination">
                       <li className="btn btn-info" onClick={previousPage}>
                            Prev
                        </li>
                          {pageNumbers.map((number) => (
                             <li className="btn btn-secondary" key={number}l onClick={() => paginate(number)}>
                                {number}
                             </li>
                          ))}
                        <li className="btn btn-info" onClick={nextPage} >
                        Next
                        </li>
                       </ul>
                    </div>
                 );

             };    


    const Listofposts = currentPosts.map(post => (
    <Post key={post.id} id={post.id} user={post.user} text={post.text} time={post.time} likes={post.likes} activeuser={CurrentUser}/>
    ))

    //Render index page
    return (
      <div className="container">
         <div className="title">
            <h1>Your Posts</h1>
         </div>
         {PostArray ? (
            <div className="blog-content-section">
               {Listofposts}
               <Paginate
                  postsPerPage={postsPerPage}
                  totalPosts={currentPosts.length}
                  previousPage={previousPage}
                  nextPage={nextPage}
                  paginate={paginate}
               />
            </div>
         ) : (
            <div className="loading">Loading...</div>
         )}
      </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App/>)