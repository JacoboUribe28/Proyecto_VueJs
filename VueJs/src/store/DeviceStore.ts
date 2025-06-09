import type { Device } from '../models/Device';
import DeviceService from '../service/DeviceService';
import { defineStore } from 'pinia';

export const useDeviceStore = defineStore('DeviceStore', {
    state: () => ({
        Devices: [] as Device[],
    }),
    actions: {
        async fetchDevices() {
            let response = await DeviceService.getDevices();
            this.Devices = response.data
            return this.Devices
        },
        async getDevice(id: number) {
            return await DeviceService.getDevice(id);
        },
        async addDevice(Device: Device) {
            return await DeviceService.createDevice(Device);
        },
        async editDevice(id: number, Device: Device) {
            return await DeviceService.updateDevice(id, Device);

        },
        async removeDevice(id: number) {
            return await DeviceService.deleteDevice(id);
        },
    }
});