import { celebrate , Joi , Segments } from 'celebrate'

export const schema = celebrate({[Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(11).max(14).required(),
    password: Joi.string().min(8).required()
    })
})
