const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/default')
const {check, validationResult} = require('express-validator');
const User = require('../models/User');

const router = Router();

router.post(
    'reg', 
    [
        check('email', 'Неккоректный email!').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов!')
        .isLength({min: 6})
    ],
    async (req, res)=>{
    try{
        const errors = validationResult(req);

        if (!errors) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Неккоректные данные при регестрации!'
            });
        };
        const {email, password} = req.body;

        const candidate = await User.findOne({ email: email});

        if (candidate) {
            return res.status(400).json({message: "Такой mail уже существует!"});
        };

        const hashPassword = await bcryptjs.hash(password, 12);
        const user = new User({email, password: hashPassword});
        await user.save()

        res.status(201).json({message: "Регистрация прошла успешна!"});
    }
    catch(error){
        res.status(500).json({message: 'Упс..ошибка, повторите запрос еще раз'})
    }
});


router.post(
    '/login',
    [
        check('email', 'Введите корректный email!').isEmail().normalizeEmail(),
        check('password', 'Введите корректный пароль!').exists()
    ], 
    async (req, res)=>{
    try{
        const errors = validationResult(req);

        if (!errors) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Неккоректные данные при входе в систему!'
            });
        };

        const {email, password} = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({message: 'Пользователь не найден!'})
        }

        const isMath = await bcryptjs.compare(password, user.password);

        if (!isMath) {
            return res.status(400).json({message: "Неверный пароль!"}); // Изменить сообщение
        }
        
        const token = jwt.sign(
            { userID: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        );

        res.status(100).json({token, userID: user.id});
    }
    catch(error){
        res.status(500).json({message: 'Упс..ошибка, повторите запрос еще раз'})
    }
})




module.exports = Router;