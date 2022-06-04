



const parseJson = async response => {
    const text = await response.text()
    try{
        const json = JSON.parse(text)
        return json
    } catch(err) {
        throw new Error("Did not receive JSON, instead received: " + text)
    }
}