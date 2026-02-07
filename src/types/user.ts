/**
 * Represents a user from the JSONPlaceholder API.
 * Only the fields we actually display are typed here
 * to keep the interface intentional and minimal.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}
