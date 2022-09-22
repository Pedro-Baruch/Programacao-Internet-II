import { celebrate , Joi , Segments } from 'celebrate'

export const registerSchema = celebrate({[Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
    })
})

export const validateEmailSchema = celebrate({[Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    code: Joi.number().min(5).required()
    })
})

export const refreshEmailSchema = celebrate({[Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required()
    })
})

export const phoneSchema = celebrate({[Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    phone: Joi.string().min(13).required()
    })
})