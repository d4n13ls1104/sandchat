import "reflect-metadata";
import { User } from "../../../entity/User";
import { Resolver, Mutation, Arg } from "type-graphql";
import { createForgotPasswordUrl } from "../../utils/createForgotPasswordUrl";
import { sendEmail } from "../../utils/sendEmail";

@Resolver()
export class ForgotPasswordResolver {
    @Mutation(() => Boolean)
    async forgotPassword(@Arg("email") email: string): Promise<boolean> {
        const user = await User.findOne({ where: { email } });

        if(!user) return true;

        const passwordResetUrl = await createForgotPasswordUrl(user.id);

        await sendEmail({
            from: '<noreply@chat.sandtee.tk>',
            to: email,
            subject: "Password reset",
            text: "Test",
            html: `<a href="${passwordResetUrl}">${passwordResetUrl}</a>`
        });

        return true;
    }
}