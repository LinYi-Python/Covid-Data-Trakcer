const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const adminData = data.administration;
// router.get('/', async (req, res) =>{
//     try{
//         let userInformation;
//         if(req.session){
//             if(req.session.userId){
//                 userInformation = await userData.getUserById(req.params.userId);
//             } 
//         }
//             res.render('landing/landing', {userInformation,partial:'landing-script'});
       
//     }catch (e){
//         res.redirect('/private');
//     }
// });


router.get('/', async (req, res) =>{
    try{
        let userInformation;
        if(req.session){
            if(req.session.userId){
                userInformation = await userData.getUserById(req.session.userId);
            } else if(req.session.adminId){
                userInformation = await adminData.getAdminById(req.session.adminId);
            }
        }
        if(req.session.adminId){
            res.redirect('administration/getInfo'); 
        } else if(req.session.userId){
            res.render('landing/landing', {userInformation,partial:'landing-script', authenticated:true});
        } else{
            res.render('landing/landing', {userInformation,partial:'landing-script', unauthenticated:true});
        }
    }catch (e){
        res.render('error/error',{errors:e, partial:'error-script'})
    }
});

// router.get('/search', async (req, res) =>{
//
// });
//
// router.post('/search', async (req, res) => {
//
// });

module.exports = router;