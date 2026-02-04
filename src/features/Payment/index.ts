import type { Payment } from "../../entities/Payment";
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios";

export const createPayment = async (packageId : string) : Promise<Payment> => { 
  var response = await api.post(`/payments?packageId=${packageId}`);
  var data : ResponseDTO<Payment> = await response.data;
  var result : Payment = data.result;
  return result;
}
