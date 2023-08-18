import Joi = require("joi");
import { RESPONSE } from "../constants/ResponseConstant";
import { ResInterface } from "../interfaces/req.interface";

export const validate = async (body: any, res: ResInterface, schema: Joi.Schema) => {
  try {
    const validation = await schema.validate(body, { abortEarly: false });
    if (validation.error) {
      const error = validation.error.details.map((e: any) => e = e.message);
      res.status(RESPONSE.HTTP_BAD_REQUEST).json({
        status: RESPONSE.HTTP_BAD_REQUEST,
        message: 'Validation failed',
        data: { error }
      });

      return false;
    }
    return true;
  } catch (err) {
    console.log(err,'-----------This is Error--------');
  }
}