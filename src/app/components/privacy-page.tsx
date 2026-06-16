import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export function PrivacyPage() {
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-12" style={{ fontSize: "12px" }}>
          <ArrowLeft size={14} /> 홈으로 돌아가기
        </Link>

        <h1 className="text-white mb-2" style={{ fontSize: "28px", fontWeight: 600 }}>개인정보처리방침</h1>
        <p className="text-white/30 mb-12" style={{ fontSize: "12px" }}>시행일: 2024년 01월 01일 | 최종 수정일: 2026년 03월 15일</p>

        <div className="space-y-10 text-white/50" style={{ fontSize: "13px", lineHeight: 2, fontWeight: 300 }}>
          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제1조 (목적)</h2>
            <p>
              아르플래닛(이하 "단체")은 개인정보보호법 등 관련 법령에 따라 이용자의 개인정보를 보호하고,
              이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제2조 (수집하는 개인정보 항목)</h2>
            <p>단체는 다음의 개인정보 항목을 수집하고 있습니다.</p>
            <ul className="mt-2 space-y-1 pl-4">
              <li>· 문의하기: 이름, 이메일, 소속 기관/단체명, 문의 내용</li>
              <li>· 공연 예약 및 협업 문의: 이름, 연락처, 이메일, 소속</li>
              <li>· 웹사이트 이용 시 자동 수집: 접속 IP, 브라우저 종류, 접속 일시</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제3조 (개인정보의 수집 및 이용 목적)</h2>
            <p>수집한 개인정보는 다음의 목적을 위해 이용됩니다.</p>
            <ul className="mt-2 space-y-1 pl-4">
              <li>· 공연 기획 및 협업 관련 문의 응대</li>
              <li>· 공연 안내 및 소식 전달</li>
              <li>· 서비스 개선을 위한 통계 분석</li>
              <li>· 불법적인 이용 방지 및 서비스 운영</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제4조 (개인정보의 보유 및 이용 기간)</h2>
            <p>
              단체는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
              단, 관련 법령에 의하여 보존이 필요한 경우에는 해당 법령에서 정한 기간 동안 보존합니다.
            </p>
            <ul className="mt-2 space-y-1 pl-4">
              <li>· 문의 내역: 응대 완료 후 1년</li>
              <li>· 계약 또는 청약 철회에 관한 기록: 5년 (전자상거래법)</li>
              <li>· 웹사이트 접속 기록: 3개월 (통신비밀보호법)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제5조 (개인정보의 제3자 제공)</h2>
            <p>
              단체는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
              다만, 이용자가 사전에 동의한 경우 또는 법령의 규정에 의한 경우에는 예외로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제6조 (개인정보의 파기 절차 및 방법)</h2>
            <p>
              단체는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 지체 없이 파기합니다.
            </p>
            <ul className="mt-2 space-y-1 pl-4">
              <li>· 전자적 파일: 복원이 불가능한 방법으로 영구 삭제</li>
              <li>· 서면 기록: 분쇄기로 분쇄하거나 소각</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제7조 (이용자의 권리와 행사 방법)</h2>
            <p>
              이용자는 언제든지 개인정보 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다.
              요청은 아래 연락처를 통해 서면, 전화 또는 이메일로 가능하며,
              단체는 지체 없이 필요한 조치를 취하겠습니다.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제8조 (개인정보 보호를 위한 안전성 확보 조치)</h2>
            <p>단체는 개인정보의 안전한 처리를 위해 다음과 같은 조치를 취하고 있습니다.</p>
            <ul className="mt-2 space-y-1 pl-4">
              <li>· 관리적 조치: 내부 관리 계획 수립·시행, 정기적 직원 교육</li>
              <li>· 기술적 조치: 개인정보 처리 시스템 접근 제한, 보안 프로그램 설치</li>
              <li>· 물리적 조치: 개인정보 보관 장소에 대한 접근 제한</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제9조 (쿠키의 사용)</h2>
            <p>
              본 웹사이트는 이용자의 편의를 위해 쿠키를 사용할 수 있습니다.
              이용자는 웹 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있으며,
              이 경우 일부 서비스 이용에 어려움이 있을 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제10조 (개인정보 보호 책임자)</h2>
            <div className="border border-white/[0.06] p-5 mt-2">
              <div className="space-y-1.5">
                <p><span className="text-white/30">성명:</span> 최혜지</p>
                <p><span className="text-white/30">직위:</span> 대표</p>
                <p><span className="text-white/30">소속:</span> 아르플래닛</p>
                <p><span className="text-white/30">주소:</span> 광주광역시 북구 대자로 146 3F 146호</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white/80 mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>제11조 (개인정보처리방침의 변경)</h2>
            <p>
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의
              추가·삭제 및 수정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여
              고지할 것입니다.
            </p>
          </section>

          <div className="border-t border-white/[0.06] pt-6 text-white/25" style={{ fontSize: "11px" }}>
            <p>본 방침은 2024년 01월 01일부터 시행됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
