import { Controller, Get } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Adapter } from "src/core/adapter";
import { IssueGuestTokenUseCase } from "./usecase";

@Throttle(1, 1)
@Controller("auth/guest")
export class IssueGuestTokenAdapter extends Adapter {
  constructor(private readonly usecase: IssueGuestTokenUseCase) {
    super();
  }

  @Get()
  async receive() {
    const result = await this.usecase.execute();

    return this.response(result);
  }

  protected getExceptionStatus(code: number): number {
    switch (code) {
      default:
        return 500;
    }
  }
}
