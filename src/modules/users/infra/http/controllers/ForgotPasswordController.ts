import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetForgotPasswordService from '@modules/users/services/ResetForgotPasswordService';

class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const resetForgotPasswordEmail = container.resolve(
      ResetForgotPasswordService,
    );
    await resetForgotPasswordEmail.execute({
      email,
    });
    return response.status(204).json();
  }
}

export default ForgotPasswordController;
