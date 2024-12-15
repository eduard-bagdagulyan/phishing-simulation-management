import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Model } from 'mongoose';
import { Attempt, AttemptDocument } from './schemas/attempt.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PhishingService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(Attempt.name)
    private readonly attemptModel: Model<AttemptDocument>,
  ) {}

  async sendPhishingEmail(email: string): Promise<Attempt> {
    const attempt = new this.attemptModel({ email });

    const phishingLink = `http://localhost:${process.env.PHISHING_SIMULATION_PORT}/api/phishing/click/${attempt._id}`;
    const emailContent = `
      <p>This is a phishing simulation test.</p>
      <p>Click <a href="${phishingLink}">here</a> to test your phishing awareness.</p>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Phishing email',
        html: emailContent,
      });
      attempt.link = phishingLink;
      await attempt.save();
      return attempt;
    } catch (e) {
      await attempt.save();
      throw new Error(`Failed to send email: ${e?.message}`);
    }
  }

  async updatePhishingAttempt(id: string): Promise<Attempt> {
    const attempt = await this.attemptModel.findById(id);

    if (!attempt) {
      throw new NotFoundException('Phishing attempt not found');
    }

    attempt.status = 'Clicked';
    await attempt.save();

    return attempt;
  }
}
