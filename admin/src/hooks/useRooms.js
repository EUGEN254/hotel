import { useState, useEffect, useCallback } from "react";
import roomService from "../services/roomService";


const useRooms = (filters = {}) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomService.getRooms(filters);
      setRooms(data.rooms);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, loading, error, refetch: fetchRooms };
};

export default useRooms;