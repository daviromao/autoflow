export enum ColorStatus {
  GREEN = "green",
  YELLOW = "yellow",
  RED = "red",
}

export interface Semaphore {
  uuid: string;
  colorStatus: ColorStatus;
  location: { lat: number; lon: number };
  carCount: number;
  emergency: boolean;
  description: string;
  fator: number;
}
