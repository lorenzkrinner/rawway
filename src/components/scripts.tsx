import Script from "next/script";

export default function Scripts() {
  return (
    <>
      <Script
        type="text/javascript"
        async
        src="https://widgets.juniphq.com/v1/junip_shopify.js"
      ></Script>
      <span
        className="junip-store-key"
        data-store-key="mUDQw6vdC3usdWaSGp47Wncn"
      />
    </>
  );
}
