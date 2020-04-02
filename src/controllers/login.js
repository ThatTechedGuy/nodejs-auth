
const handleLogin = (db) => (_, res) => {
    console.log(db);
    res.status(200).json({message:'LOGIN OK'});
}


const login = {
    handleLogin: handleLogin
}

export default login;
