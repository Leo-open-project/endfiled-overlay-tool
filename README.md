# E.O.T (Endfield Overlay Tool)

> *End of Transmission... or is it?*

Arknights: Endfield 건설 모드에서 참조 이미지를 화면 위에 투명하게 띄워주는 오버레이 도구입니다.

## Features

- **투명 오버레이** - 게임 위에 이미지를 반투명하게 표시
- **클릭 통과 (잠금)** - 잠금 시 오버레이를 무시하고 게임 조작 가능
- **이미지 조작** - 드래그 이동, 확대/축소, 90도 회전
- **크로마 키** - 특정 색상을 투명하게 제거 (허용 범위 조절 가능)
- **격자 표시** - 붉은색 점선 격자로 정렬 보조
- **투명도 조절** - 슬라이더로 이미지 투명도 조절

## Shortcuts

| 단축키 | 기능 |
|--------|------|
| `Ctrl+F11` | 오버레이 표시/숨김 |
| `Ctrl+F12` | 잠금 토글 (클릭 통과) |
| `Ctrl++` | 확대 (1%) |
| `Ctrl+-` | 축소 (1%) |
| 이미지 드래그 | 이미지 위치 이동 (잠금 해제 시) |

## Usage

1. 앱 실행 후 **이미지 불러오기** 버튼으로 참조 이미지 로드
2. 이미지를 드래그하여 원하는 위치로 이동
3. `Ctrl++/-`로 크기 조절, 회전 버튼으로 회전
4. 필요시 크로마 키로 배경색 제거
5. 격자를 켜서 정렬 확인
6. 배치 완료 후 `Ctrl+F12`로 잠금 (클릭 통과 모드)
7. `Ctrl+F11`로 필요 시 숨기기/보이기

## Build

```bash
# 의존성 설치
npm install

# 개발 실행
npm start

# Windows portable exe 빌드
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

## Tech Stack

- Electron
- electron-builder (portable exe)

## Author

**이루릴a** - [GitHub](https://github.com/Leo-open-project) · leona.8904@gmail.com

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0).

본 프로젝트는 GPL-3.0 라이선스를 따릅니다.
자세한 내용은 LICENSE 파일을 참고하세요.