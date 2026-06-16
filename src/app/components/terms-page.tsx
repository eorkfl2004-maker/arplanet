import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export function TermsPage() {
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-12" style={{ fontSize: "12px" }}>
          <ArrowLeft size={14} /> 홈으로 돌아가기
        </Link>

        <h1 className="text-white mb-2" style={{ fontSize: "28px", fontWeight: 600 }}>이용약관</h1>
        <p className="text-white/30 mb-12" style={{ fontSize: "12px" }}>시행일: 2024년 01월 01일</p>

        <div className="space-y-10 text-white/50" style={{ fontSize: "13px", lineHeight: 2, fontWeight: 300 }}>
          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제1조 (목적)</h2>
            <p>
              본 약관은 아르플래닛(이하 "단체")이 운영하는 웹사이트(이하 "사이트")에서 제공하는
              서비스(이하 "서비스")의 이용에 관한 조건 및 절차, 단체와 이용자 간의 권리·의무 및
              책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제2조 (정의)</h2>
            <ul className="space-y-1 pl-4">
              <li>· "사이트"란 단체가 운영하는 웹사이트(arplanet.co.kr)를 말합니다.</li>
              <li>· "이용자"란 사이트에 접속하여 본 약관에 따라 서비스를 이용하는 자를 말합니다.</li>
              <li>· "서비스"란 사이트를 통해 제공되는 공연 정보, 문의, 예약 등 관련 제반 서비스를 말합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제3조 (약관의 효력 및 변경)</h2>
            <p>
              본 약관은 사이트를 통해 공시함으로써 효력을 발생합니다.
              단체는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위에서
              본 약관을 변경할 수 있으며, 변경된 약관은 사이트에 공지함으로써 효력을 발생합니다.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제4조 (서비스의 제공 및 변경)</h2>
            <p>단체는 다음과 같은 서비스를 제공합니다.</p>
            <ul className="mt-2 space-y-1 pl-4">
              <li>· 클래식 음악 공연 정보 제공</li>
              <li>· 공연 문의 및 협업 제안 접수</li>
              <li>· 소속 아티스트 정보 제공</li>
              <li>· 포트폴리오 및 뉴스 제공</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제5조 (서비스의 중단)</h2>
            <p>
              단체는 시스템 점검, 장비의 보수, 천재지변 또는 이에 준하는 불가항력적 사유가
              발생한 경우 서비스의 전부 또는 일부를 제한하거나 중단할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제6조 (이용자의 의무)</h2>
            <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="mt-2 space-y-1 pl-4">
              <li>· 타인의 개인정보를 부정하게 사용하는 행위</li>
              <li>· 사이트의 정보를 무단으로 변경하는 행위</li>
              <li>· 단체가 금지한 정보의 송신 또는 게시</li>
              <li>· 단체 및 제3자의 저작권 등 지적재산권을 침해하는 행위</li>
              <li>· 기타 관련 법령에 위반되는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제7조 (저작권)</h2>
            <p>
              사이트에 게시된 모든 콘텐츠(텍스트, 이미지, 영상, 음원 등)에 대한 저작권 및
              지적재산권은 단체에 귀속됩니다. 이용자는 단체의 사전 동의 없이 이를
              상업적 목적으로 복제, 배포, 방송, 기타 방법으로 이용할 수 없습니다.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제8조 (면책 조항)</h2>
            <p>
              단체는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
              서비스 제공에 관한 책임이 면제됩니다. 또한 이용자의 귀책사유로 인한 서비스 이용의
              장애에 대하여는 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제9조 (분쟁 해결)</h2>
            <p>
              본 약관과 관련하여 분쟁이 발생한 경우, 단체와 이용자는 분쟁 해결을 위해
              성실히 협의합니다. 협의가 이루어지지 않을 경우, 관할 법원은 단체의
              소재지를 관할하는 법원으로 합니다.
            </p>
          </section>

          <div className="border-t border-white/[0.06] pt-6 text-white/25" style={{ fontSize: "11px" }}>
            <p>본 약관은 2024년 01월 01일부터 시행됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
