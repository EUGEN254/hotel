import { useState, useEffect, useCallback } from "react";
import roomService from "../../services/guest/roomService";


const useRooms = (params = {}) => {
  const [rooms, setRooms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomService.getRooms(params);
      setRooms(data.rooms);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]); // re-fetch when query params change

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, loading, error, refetch: fetchRooms };
};

export default useRooms;