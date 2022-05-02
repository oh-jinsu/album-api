import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PresentFilmsUseCase } from "./usecase";

@Injectable()
export class PresentFilmsAdapter {
  constructor(private readonly usecase: PresentFilmsUseCase) {}

  @Cron("0 30 21 * * 0", {
    timeZone: process.env.TZ,
  })
  async receive() {
    await this.usecase.execute();
  }
}
