import { commonService } from "@/service/common";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function useSettings() {
    const { isLoading, data: settings, isError } = useQuery({
        queryFn: () =>  commonService.getSettings(),
        queryKey: ['settings']
    })

    const { payment_scanner, support_number, support_email } = useMemo(() => {

        const settingsValues  = {
         payment_scanner: '',
         support_number: '',
         support_email: ''  
       } 

       if(isLoading || isError || settings?.length === 0) return settingsValues
   
       settings?.forEach(({ key, value }) => {
          if(Object.keys(settingsValues).includes(key)) {
             settingsValues[key as keyof typeof settingsValues] = value
          }
       })

       return settingsValues
       

    },[isLoading, isError, settings])

    return { payment_scanner, support_number, support_email, isFetching: isLoading }
}
