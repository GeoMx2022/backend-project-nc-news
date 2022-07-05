// ERROR HANDLING MIDDLEWARE
//Invalid Path
exports.handleInvalidPaths = (req, res) => {
    res.status(404).send({msg: "Not Found - Invalid Path"}) 
};
  
//Custom Error
exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);    
}; 
  
//Psql Error
exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02' || '23502') {
        res.status(400).send({ msg: err.msg || 'Bad Request - Invalid Input' });
    } else next(err);
};
  
//Server Error
exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
};
  