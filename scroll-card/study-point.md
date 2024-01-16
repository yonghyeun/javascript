# 유튜브를 몇회독 하며 기억해야 할 정보들을 적었습니다

# 기본 원리

부모 태그인 div 태그의 높이가 600vh 라고 했을 때

스크롤이 200vh ~ 500 vh 사이에서 카드 스크롤 애니메이션이 나타나게 할거임

`sticky` 라는 클래스를 가진 태그는 100vh 의 높이를 가지며

부모 태그로부터 100vh 아래의 단계에 존재함

내 스크롤Y 가 200vh ~ 500vh 일 때는 position : sticky 가 되어

200vh ~ 500 vh 사이에 있을때는 해당 태그만 보이도록 함

이후일 때는 포지션을 다시 static 으로 바꿔 보이지 않게 함

# CSS 기본 구조

- `transfrom-style` 을 이용해서 카드를 회전 시킬 때 3D 에서 회전 시키듯이 보이게 함
- `transform` : perspective() <- 트랜스폼 될 때 보이는 관점 ? 이건 공부해봐야할듯

- `backface-visibility` <- 뒷면에 대한 글자가 보이는지 안보이는지 하는 설정인가 ? 공부해봐야 할듯
- background-image 에 쓰인 repeating-linear-gradient 생각해보기

# JS

offsetTop , innerHeight , offsetHeight 공부하기
scrollX , scrollY 생각해보기

애니메이션이 발생되는 스텝을 어떻게 나눌지 생각해보자

규칙성을 사고해보기
