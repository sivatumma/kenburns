/*
	This file is meant for Strings that are used in user authentication workflow management,
	in english language. For now, this looks like ad-hoc, but soon, We shall fit this in a standardized 
	folder structure as well as fit it in enyo Application scope.

*/
enyo.kind({
    name: "strings_en_US",
    statics: {
        login: {
            branding:{
                heading:"Smart City Chicago",
                subHeading:"IoT World Forum"
            },
            login_heading: "Log In",
            login_sub_heading: "Login via facebook or create an account",
            login_using_facebook_button_text: "Log In using Facebook",
            input_email_placeholder: "Email",
            input_password_placeholder: "Password",
            input_login_button_text: "Log In",
            register_url_text: "Register",
            forgot_password_url_text: "Forgot Password?",
            alerts: {
                client_validation_alerts: {
                    username_not_entered: "Please input your Username",
                    password_not_entered: "Please input your Password",
                    fb_connected : "Logging you in ",
                },
                server_errors: {
                    //	This topic is not yet clear as to how @Mahesh would send us depending on the 
                    //	User locale of a client device.
                    //	I think there is no need for this json block as the server is 
                    //	asssumed to be sending correct messages depending on the User locales, as
                    //	we will be sending the locale info when a user talks to server through our app
                }
            },
            links:{register:"Register",
            forgot_password:"Forgot Password ?"}
        },
        register: {
            registration_heading: "Register",
            registration_sub_heading: "Sign up via facebook or create an account",
            signup_using_facebook_button_text: "Sign Up using Facebook",
            input_email_placeholder: "Email",
            input_password_placeholder: "Password",
            input_login_button_text: "Log In",
            input_age_placeholder: "Age",
            select_gender_placeholder: "Sex",
            agree_terms_text: "I agree to the Terms of Use",
            input_register_button_text: "Register",
            alerts: {
                client_validation_alerts: {
                    username_not_entered: "Please input your Username",
                    password_not_entered: "Please input your Password",
                    age_not_entered: "Please enter your Age",
                    age_NaN: "Please enter age in numbers",
                    gender_not_correct: "Please let us know your Gender",
                    terms_not_agreed: "Please agree Terms of use"
                },
                server_errors: {
                    //	This topic is not yet clear as to how @Mahesh would send us depending on the 
                    //	User locale of a client device.
                    //	I think there is no need for this json block as the server only 
                    //	asssumed to be sending correct messages depending on the User locales, as
                    //	we will be sending the locale info when a user talks to server through our app
                }
            },
            loginPointerText:"Already registered? "
        },
    }
});