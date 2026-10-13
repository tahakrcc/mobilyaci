import { LegalPage } from "@/components/legal-page";
export default function Page(props: { params: Promise<{ locale: string }> }) { return LegalPage("kvkk", props); }
