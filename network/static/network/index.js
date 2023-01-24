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

    </div>

    )
}
///////////////////////////////////////////////////////
//creating App for this view 

function App(prop) {
    const [PostArray, setPostArray] = React.useState([]);

    React.useEffect(() => {
    fetch('/api/Post/')
        .then(response => response.json())
        .then(posts => {setPostArray(posts)})
    }, [])

    console.log(PostArray)
    const Listofposts = PostArray.map(post => (
    <Post key={post.id} id={post.id} user={post.user} text={post.text} time={post.time}/>
    ))

    return (
    <div>
    {Listofposts}
    </div>
    )
}
        ////adding post
        //function add_post() {
            //setPostArray(PrevPostArray => {
            
            ////Take new post
            //const user = form['user'].value;
            //const text = form['text'].value;
            //const date = Date.now()
                    
            ////Send post via API 
            //fetch('/api/Post/', {
            //method: 'POST',
            //body: JSON.stringify({
            //user: user,
            //text: text,
            //date: date,
            //        })
            //    })
            //.then(response => response.json())
            //.then(result => {
            // Print result to console
            //console.log(result);
            //                 }
            //    )
            
            //return [...prevThingsArray, result]
            //                })}

///////////////////////////////////////////////////////
//setting up rendering for this view (should be seperate js file)

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App/>)