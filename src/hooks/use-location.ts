export function useLocation() {
    const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string | null> => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            return data?.display_name || null;
        } catch (error) {
            console.error("Error fetching address:", error);
            return null;
        }
    };

    return { getAddressFromCoordinates };
}
