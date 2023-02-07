function addlike() {
    const a = PostArray[this]
    setLikeCounter(a.likes)
    setLikeCounter(LikeCounter + 1) 
    fetch(`/api/Post/${a.id}`), {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'
        },
        body: JSON.stringify(LikeCounter)
    }
}