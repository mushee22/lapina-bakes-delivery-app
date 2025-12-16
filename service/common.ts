import apiClient from "@/lib/api-client";
import { Location, Store } from "@/type/store";
import { Settings } from "@/type/user";

class CommonService {
    async getLocations() {
        const response = await apiClient.get<Location[]>(`locations/delivery-boy/my-locations`);
        return response.data;
    }

    async getDeliveryStores() {
        const response = await apiClient.get<Store[]>(`stores/delivery-boy/my-stores`);
        return response.data;
    }

    async getSettings() {
        const response = await apiClient.get<Settings[]>(`settings`);
        return response.data;
    }

    async getStores() {
        const response = await apiClient.get<Store[]>(`stores`);
        return response.data;
    }
}

export const commonService = new CommonService();
