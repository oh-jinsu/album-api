import { Controller, Get } from "@nestjs/common";
import { Adapter } from "src/core/adapter";

@Controller("health")
export class HealthAdapter extends Adapter {
  @Get()
  receive() {
    return "I am really healthy";
  }

  protected getExceptionStatus(code: number): number {
    switch (code) {
      default:
        return 500;
    }
  }
}
