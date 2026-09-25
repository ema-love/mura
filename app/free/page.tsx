import { permanentRedirect } from "next/navigation";

/** A short, shareable address for the free Student Reset. */
export default function Free() {
  permanentRedirect("/products/student-reset");
}
