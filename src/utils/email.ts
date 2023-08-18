import * as sgMail from '@sendgrid/mail';
import { env } from '../environments/env';





export class Email {
    private email: string;

    constructor(email: string) {
        sgMail.setApiKey(env().sendGridApiKey);
        this.email = email;
    }


    async sendVerificationEmail(verificationUrl: string) {

        const msg = {
            to: this.email,
            from: 'rahul.kannoujia@mobilecoderz.com',
            subject: 'Account Verification',
            text: 'Verify your account',
            html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                
                <style>
                        
                @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,700;1,600&family=Montserrat:wght@100;300;400;600;700&display=swap');
                *{
                    margin: 0;
                    padding: 0;
                    font-family: 'Josefin Sans', sans-serif;
                font-family: 'Montserrat', sans-serif;
                }
                body{
                    background-color: black;
                }
                .verifyWrapper{
                    width: 100%;
                    min-height: 100vh;
                    margin: 0 auto;
                    background-color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            
                .InnerWrapper{
                    background-color: #ddd;
                display: flex;
                align-items: center;
                justify-content: center;
                }
            
                </style>
                <title>Document</title>
            </head>
            
            <body>
                <div class="verifyWrapper">
                    <div class="container">
                        <div class="InnerWrapper">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <p style="text-align:center;width:300px;margin:0 auto;">
            
                                        <img src="./images/card-logo.png" alt="logo" style="width: 167px;margin: 0 auto;display: block;">
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p style="text-align: center; font-size: 20px; font-weight: 700; margin:20px; line-height: 37px;">
                                                Greetings User, <br>
                                                Thank you for signing up on ListApp
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: center;">
                                            <p style="font-size: 17px;font-weight:400; color: #616161;
                                            ;line-height: 37px;">We need to
                                                verify that you have signed up using  <br> this email id. Please click on the below button
                                                to  <br>  verify. You wil be able to use the platform after <br> email verification is
                                                successful.
                                            </p>
                                        </td>
                                    </tr>
            
                                    <tr>
                                        <td style="text-align:center">
                                            <a href=${verificationUrl} style="font-size: 18px;font-weight:600;padding:15px 60px; margin: 25px 0 30px 0; border: none; outline: none; background: #39B549; color: #fff; border-radius: 40px;
                                            ">Verify Now</a>
                                        </td>
                                    </tr>
            
                                    <tr style="text-align: center;">
                                        <td>
                                            <p class="text-wrap" style="font-size: 17px;font-weight: 400; margin-bottom: 30px;color: #616161;
                                            ">or copy-paste this link in your browser</p>
                                        </td>
                                    </tr>
                                    <tr style=
                                    "margin-bottom: 20px;">
                                        <td>
                                        <div style="text-align: center; font-size: 15px; font-weight: 700;">
                                                 <a href="#" style="padding:10px 80px;color: #373737;background: #F2F2F2; display: inline-block;">https://wefundus.com/#/auth</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr style="text-align: center;">
                                        <td>
                                            <p class="text-wrap" style="font-size: 18px;font-weight: 700; margin: 30px">Welcome to Wefundus.com</p>
                                        </td>
                                    </tr>
            
                                    <tr>
                                        <td>
                                            <div style="font-size:14px;color:#fff; text-align: center; line-height: 33px; background-color: #39B549; padding: 20px;">
                                                <p>Did you receive this email without signing up? <br>
                                                    This verification link will expire in 10 minutes.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </body>
            
            </html>`,
        }

        sgMail
            .send(msg)
            .then((response: any) => {
                console.log(response[0].statusCode)
                console.log(response[0].headers)
                return true;
            })
            .catch((error: any) => {
                console.error(error)
            })
    }


    async sendForgetPasswordEmail(resetUrl: string) {

        const msg = {
            to: this.email,
            from: 'rahul.kannoujia@mobilecoderz.com',
            subject: 'Forget Password',
            text: 'Reset Password link',
            html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                
                <style>
                        
                @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,700;1,600&family=Montserrat:wght@100;300;400;600;700&display=swap');
                *{
                    margin: 0;
                    padding: 0;
                    font-family: 'Josefin Sans', sans-serif;
                font-family: 'Montserrat', sans-serif;
                }
                body{
                    background-color: black;
                }
                .verifyWrapper{
                    width: 100%;
                    min-height: 100vh;
                    margin: 0 auto;
                    background-color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            
                .InnerWrapper{
                    background-color: #ddd;
                display: flex;
                align-items: center;
                justify-content: center;
                }
            
                </style>
                <title>Document</title>
            </head>
            
            <body>
                <div class="verifyWrapper">
                    <div class="container">
                        <div class="InnerWrapper">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <p style="text-align:center;width:300px;margin:0 auto;">
            
                                        <img src="./images/card-logo.png" alt="logo" style="width: 167px;margin: 0 auto;display: block;">
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p style="text-align: center; font-size: 20px; font-weight: 700; margin:20px; line-height: 37px;">
                                                Greetings User, <br>
                                                Thank you for signing up on WeFundUs
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: center;">
                                            <p style="font-size: 17px;font-weight:400; color: #616161;
                                            ;line-height: 37px;">We have sent you Reset Password Link on <br> this email id. Please click on the below button
                                                to  <br>  Reset your password.  
                                            </p>
                                        </td>
                                    </tr>
            
                                    <tr>
                                        <td style="text-align:center">
                                            <a href=${resetUrl} style="font-size: 18px;font-weight:600;padding:15px 60px; margin: 25px 0 30px 0; border: none; outline: none; background: #39B549; color: #fff; border-radius: 40px;
                                            ">Reset Password</a>
                                        </td>
                                    </tr>
            
                                    <tr style="text-align: center;">
                                        <td>
                                            <p class="text-wrap" style="font-size: 17px;font-weight: 400; margin-bottom: 30px;color: #616161;
                                            ">or copy-paste this link in your browser</p>
                                        </td>
                                    </tr>
                                    <tr style=
                                    "margin-bottom: 20px;">
                                        <td>
                                        <div style="text-align: center; font-size: 15px; font-weight: 700;">
                                                 <a href="#" style="padding:10px 80px;color: #373737;background: #F2F2F2; display: inline-block;">https://wefundus.com/#/auth</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr style="text-align: center;">
                                        <td>
                                            <p class="text-wrap" style="font-size: 18px;font-weight: 700; margin: 30px">Welcome to Wefundus.com</p>
                                        </td>
                                    </tr>
            
                                    <tr>
                                        <td>
                                            <div style="font-size:14px;color:#fff; text-align: center; line-height: 33px; background-color: #39B549; padding: 20px;">
                                                <p>Did you receive this email without signing up? <br>
                                                    This Reset Password link will expire in 10 minutes.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </body>
            
            </html>`,
        }

        sgMail
            .send(msg)
            .then((response: any) => {
                console.log(response[0].statusCode)
                console.log(response[0].headers)
                return true;
            })
            .catch((error: any) => {
                console.error(error)
            });

    }
}
