import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PURCHASE_PARTS_COUNT } from "my-variables";
import { purchaseEmailSchema, type TPurchaseEmailFormData } from "my-zod";
import { useForm } from "react-hook-form";

export interface IUsePurchaseEmailFormParams {
  defaultMaxPricePerPart?: number;
  defaultPartsCount?: number;
}

export function usePurchaseEmailForm(params?: IUsePurchaseEmailFormParams) {
  const methods = useForm<TPurchaseEmailFormData>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      isExistingAssociate: false,
      associateNumber: "",
      partsCount: params?.defaultPartsCount ?? DEFAULT_PURCHASE_PARTS_COUNT,
      maxPricePerPart: params?.defaultMaxPricePerPart ?? 0,
    },
    resolver: zodResolver(purchaseEmailSchema),
  });

  return methods;
}
