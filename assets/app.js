/* ===== MEZASTAR BINDER · app =====
   MEGA UPDATE 2026-09-20 · 50 functions in this build:
   F1 grade filter · F2 bosses this tag beats · F3 cover-my-weakness hunt per tag · F4 fragility/4x warnings
   F5 compare my tags · F6 full counter matrix · F7 field trio · F8 compare up to 3 bosses · F9 battle plan
   F10 random boss drill · F11 fuzzy voice ready names · F12 share result · F13 speak result · F14 completion stats
   F15 V2 hunt list with owned badges · F16 wishlist · F17 wishlist hunt order · F18 type gap advisor
   F19 PE ladder · F20 trigger inventory · F21 grade breakdown · F22 PE per type leaderboard · F23 auto team build
   F24 save teams · F25 team danger report · F26 team coverage meter · F27 counter log with streaks
   F28 win rate · F29 log cleanup · F30 credit budget planner · F31 expected 6 star cost · F32 session tracker
   F33 Vietnamese UI · F34 roulette timing trainer · F35 ball odds reference · F36 golden turn planner
   F37 SS hunting tactic guide · F38 data export · F39 data import · F40 reset data · F41 offline install hint
   F42 achievements · F43 safer picks (defense first) · F44 PE density sort · F45 anti duplicate advisor
   F46 dupe trade list · F47 spare bag advisor · F48 type coverage checklist · F49 rotating pro tips · F50 dark battery saver */
const FEATURES = [
 "Grade filter (6★/5★/4★)","Bosses this tag beats","Cover my weak spots per tag","Fragility and 4x warnings",
 "Compare two of my tags side by side","Full counter matrix for a boss","Field trio suggestion","Compare up to 3 bosses",
 "Turn by turn battle plan","Random boss drill","Name matching built for typos","Share result as text",
 "Speak the pick out loud","Collection completion stats","V2 hunt list with owned badges","Wishlist with hearts",
 "Wishlist hunt order","Type gap advisor","PE ladder of the whole set","Trigger inventory (Dynamax/Mega/Z Move)",
 "Grade breakdown bars","PE per type leaderboard","Auto team builder","Save and load teams","Team danger report",
 "Team coverage meter","Counter log with streaks","Win rate tracking","Log cleanup","Credit budget planner",
 "Expected cost per 6 star tag","Session money tracker","Vietnamese interface","Roulette timing trainer",
 "Ball odds reference","Golden turn planner","SS hunting tactics guide","Export all data","Import data backup",
 "Reset everything","Achievements","Safer picks mode (defense first)","PE density sorting","Anti duplicate advisor",
 "Dupe trade list","Spare bag advisor","Type coverage checklist","Rotating pro tips","Battery saver dim mode"
];

const TYPE_ICON = { Normal:"⭐", Fire:"🔥", Water:"💧", Electric:"⚡", Grass:"🍃", Ice:"❄️",
  Fighting:"✊", Poison:"☠️", Ground:"⛰️", Flying:"🕊️", Psychic:"🔮", Bug:"🐛",
  Rock:"🪨", Ghost:"👻", Dragon:"🐉", Dark:"🌙", Steel:"⚙️", Fairy:"✨" };
const TYPE_SVG = {"Bug":"m342.198.501279c.373-.5317158 1.105-.660937 1.637-.288625l36.354 25.455546c.532.3723.661 1.1051.289 1.6368l-50.599 72.2623c24.599 7.8587 41.358 16.3357 41.358 16.3357s-40.964 70.462-110.443 70.462-118.85-65.672-118.85-65.672 17.506-11.172 43.456-20.7539l-55.5-66.1415c-.417-.4973-.352-1.2386.145-1.6558l33.997-28.52715c.498-.41723 1.239-.35238 1.656.14487l70.272 83.74688c6.017-.6806 12.147-1.061 18.333-1.061 8.891 0 17.771.6759 26.44 1.8229zm13.746 189.200721c18.541-13.242 46.597-47.804 46.597-47.804s71.664 56.79 71.664 177.206c0 120.415-123.896 192.888-123.896 192.888s-59.195-59.781-73.727-135.562c-14.531-75.781 21.496-159.927 21.496-159.927s39.324-13.559 57.866-26.801zm-199.683 0c-18.541-13.242-46.597-47.804-46.597-47.804s-71.664 56.79-71.664 177.206c0 120.415 123.896 192.888 123.896 192.888s59.195-59.781 73.727-135.562c14.531-75.781-21.496-159.927-21.496-159.927s-39.324-13.559-57.866-26.801z","Dark":"M229.379 452.85C239.106 454.339 249.068 455.111 259.212 455.111C367.214 455.111 454.767 367.558 454.767 259.556C454.767 151.553 367.214 64 259.212 64C251.966 64 244.811 64.3941 237.77 65.1621C291.345 105.751 326.767 176.062 326.767 256C326.767 340.04 287.616 413.44 229.379 452.85ZM255.656 512C397.041 512 511.656 397.385 511.656 256C511.656 114.615 397.041 0 255.656 0C114.271 0 -0.34375 114.615 -0.34375 256C-0.34375 397.385 114.271 512 255.656 512Z","Dragon":"M280.702 254.881C284.172 252.765 287.116 248.331 289.49 243.403C320.735 256.173 342.692 286.349 342.692 321.54C342.692 368.29 303.942 406.189 256.142 406.189C236.52 406.189 218.423 399.802 203.906 389.039C199.144 386.784 195.226 384.618 192.02 382.845C187.047 380.096 183.786 378.293 181.744 378.575C175.775 379.398 177.508 384.89 179.083 389.879C180.152 393.268 181.149 396.425 179.606 397.727C177.992 399.091 172.764 394.106 166.655 388.282C158.339 380.353 148.391 370.868 143.7 373.717C139.991 375.97 143.592 382.081 148 389.561L148.327 390.116C150.189 393.278 152.347 396.498 154.316 399.436C158.319 405.407 161.543 410.219 159.93 411.033C157.98 412.017 144.394 402.847 132.945 390.116C128.526 385.203 124.246 379.877 120.268 374.928L120.268 374.927C111.561 364.093 104.307 355.068 100.235 356.137C95.3365 357.423 99.0421 367.527 104.487 377.25C107.033 381.797 110.028 386.427 112.621 390.436L112.621 390.437C116.654 396.671 119.715 401.402 118.605 401.984C117.107 402.767 103.926 389.914 94.9734 373.717C89.6559 364.096 85.1909 353.464 81.5761 344.857C77.656 335.522 74.7359 328.569 72.8131 327.869C66.1325 325.438 66.1325 339.059 68.8119 358.718C69.1614 361.283 69.6819 363.973 70.3228 366.712C96.307 450.785 176.128 512 270.567 512C386.084 512 479.728 420.412 479.728 307.432C479.728 199.9 394.899 111.747 287.12 103.494C287.256 98.4284 289.9 88.383 289.9 88.383C289.9 88.383 308.927 42.3472 309.933 32.5099C309.999 31.857 310.078 31.1475 310.163 30.3919C311.348 19.7629 313.553 0 296.551 0C287.471 0 283.249 6.75464 278.42 14.4799L278.42 14.48C276.566 17.4457 274.622 20.5545 272.28 23.479C255.412 44.5436 227.048 70.8488 210.965 84.8631C176.971 114.484 143.619 138.828 124.167 153.026L124.167 153.026L124.166 153.027C115.319 159.484 109.348 163.843 107.5 165.644C93.574 179.22 43.6418 269.286 43.6418 269.286C43.6418 269.286 27.4943 298.182 33.2338 304.043C38.9733 309.903 52.8141 308.56 52.8141 308.56C52.8141 308.56 238.755 265.903 255.402 262.539C259.884 261.633 263.048 261.11 265.477 260.709C272.072 259.62 273.256 259.424 280.702 254.881ZM149.235 200.064C139.254 209.551 122.701 232.196 122.701 232.196C122.701 232.196 153.465 234.091 170.408 217.986C187.352 201.88 183.47 174.433 183.47 174.433C183.47 174.433 159.215 190.577 149.235 200.064Z","Electric":"M152.56 0.583659C152.461 0.29796 152.674 0 152.976 0H332.805C332.998 0 333.169 0.125587 333.226 0.309782L415.824 267.171C415.911 267.454 415.7 267.741 415.403 267.741H295.684C295.538 267.741 295.433 267.88 295.473 268.021L364.135 509.726C364.269 510.195 363.654 510.501 363.361 510.111L96.5295 155.267C96.3115 154.977 96.5184 154.563 96.881 154.563H205.536C205.687 154.563 205.793 154.414 205.743 154.271L152.56 0.583659Z","Fairy":"M102.726 405.978L184.848 382.166L255.778 511.857C255.871 512.025 256.112 512.025 256.204 511.857L327.134 382.166L409.257 405.978C409.441 406.031 409.612 405.86 409.557 405.676L385.741 325.179L511.856 256.204C512.025 256.112 512.025 255.871 511.857 255.779L384.702 186.235L409.557 102.225C409.612 102.041 409.441 101.87 409.257 101.923L325.208 126.294L256.204 0.126188C256.112 -0.0420597 255.871 -0.0420644 255.779 0.126184L186.775 126.294L102.726 101.923C102.542 101.87 102.371 102.041 102.426 102.225L127.281 186.235L0.126188 255.779C-0.0420597 255.871 -0.0420644 256.112 0.126184 256.204L126.241 325.179L102.426 405.676C102.371 405.86 102.542 406.031 102.726 405.978ZM166.452 256.876L224.631 288.695L256.45 346.873C256.542 347.042 256.784 347.042 256.876 346.873L288.695 288.695L346.873 256.876C347.041 256.784 347.041 256.542 346.873 256.45L288.695 224.631L256.876 166.453C256.784 166.284 256.542 166.284 256.45 166.453L224.631 224.631L166.452 256.45C166.284 256.542 166.284 256.784 166.452 256.876Z","Fighting":"M88.2336 42.5656C94.4299 18.1014 116.593 0 142.983 0C162.778 0 180.195 10.1847 190.279 25.6H206.792C217.051 15.0716 231.384 8.53333 247.245 8.53333C270.499 8.53333 290.471 22.5882 299.129 42.6667H312.954C321.617 37.2585 331.853 34.1333 342.818 34.1333C366.073 34.1333 386.044 48.1882 394.702 68.2667H432.297C432.618 68.2667 432.919 68.3532 433.178 68.5041C434.895 68.347 436.634 68.2667 438.391 68.2667C469.582 68.2667 494.866 93.5514 494.866 124.742V294.086L494.867 294.4L494.866 294.714V297.153C494.866 298.186 494.838 299.215 494.782 300.239C491.384 417.717 385.749 512 255.933 512C123.974 512 17 414.577 17 294.4C17 236.391 41.9249 183.683 82.5535 144.675C82.4522 201.228 83.4074 259.694 87.8107 258.691C99.6011 256.003 90.3891 80.8395 88.2336 42.5656Z","Fire":"M352.258 395.394C358.584 372.263 346.305 324.71 346.305 324.71C346.305 324.71 337.399 363.449 323.483 377.767C311.611 389.98 297.066 398.451 276.206 400.677C293.261 392.393 304.99 375.12 304.99 355.155C304.99 327.129 281.878 304.409 253.368 304.409C224.858 304.409 201.745 327.129 201.745 355.155C201.745 362.809 203.47 370.068 206.557 376.576C188.725 362.37 185.921 339.594 185.921 339.594C185.921 339.594 166.009 422.264 220.875 461.152C275.74 500.04 383.219 466.614 383.219 466.614C383.219 466.614 229.41 574.837 115.436 457.05C17.2568 355.584 89.8111 222.003 89.8111 222.003C89.8111 222.003 86.6777 234.395 86.6777 248.78C86.6777 263.165 94.477 274.11 94.477 274.11C94.477 274.11 117.742 225.071 135.848 205.128C152.984 186.254 174.465 170.946 193.019 157.724C207.301 147.546 219.849 138.604 227.343 130.223C268.62 84.0687 243.311 0 243.311 0C243.311 0 289.841 41.02 302.831 93.9978C307.783 114.192 304.597 137.169 301.749 157.716C297.125 191.072 293.388 218.025 326.793 216.276C380.775 213.449 333.866 130.223 333.866 130.223C333.866 130.223 456.318 194.583 447.17 307.145C438.021 419.707 313.324 445.297 313.324 445.297C313.324 445.297 345.931 418.525 352.258 395.394Z","Flying":"M178.712 477.733C253.715 477.733 317.927 436.048 344.436 376.956C344.76 376.235 238.007 404.699 241.411 394.637C242.931 390.144 308.371 366.238 356.048 338.354C383.451 322.327 396.07 288.4 396.07 288.4C396.07 288.4 349.903 310.815 326.564 316.501C279.532 327.961 238.131 326.727 238.131 325.533C238.131 322.951 306.876 309.889 402.424 251.664C447.367 224.277 459.574 177.103 459.574 177.103C459.574 177.103 410.163 206.535 380.293 216.252C309.457 239.295 244.815 246.239 244.815 243.121C244.815 236.445 301.702 220.802 362.016 191.577C393.376 176.382 420.535 156.53 452.008 134.453C503.506 98.332 511.999 34 511.999 34C511.999 34 461.207 66.7601 436.42 77.6394C334.141 122.531 243.829 146.079 178.712 151.177C80.416 158.873 0 227.456 0 316.501C0 405.547 80.0119 477.733 178.712 477.733Z","Ghost":"M368.952 510.227C322.769 512.591 269.896 512.591 251.928 510.227C111.77 491.788 0 389.313 0 250.8C0 112.287 114.615 0 256 0C397.385 0 512 112.287 512 250.8C512 315.221 487.207 373.969 446.46 418.387C435.395 430.448 450.577 438.908 466.002 447.504C481.13 455.935 496.492 464.496 487.564 476.712C477.726 490.173 424.392 507.389 368.952 510.227ZM220 219.45C220 241.092 202.091 258.637 180 258.637C157.909 258.637 140 241.092 140 219.45C140 204.935 148.055 192.264 160.024 185.491C160.713 204.362 176.229 219.449 195.269 219.449H220C220 219.449 220 219.45 220 219.45ZM343.976 185.491C343.287 204.362 327.771 219.449 308.731 219.449H284C284 219.449 284 219.45 284 219.45C284 241.092 301.909 258.637 324 258.637C346.091 258.637 364 241.092 364 219.45C364 204.935 355.945 192.264 343.976 185.491Z","Grass":"m97.4121 440.649c-1.7574-1.653-3.4954-3.338-5.2132-5.056-90.68455-90.684-90.68453-237.713 0-328.397 90.6841-90.6849 379.6401-96.7516 379.6401-96.7516s39.442 334.4646-51.242 425.1486c-80.54 80.54-205.522 89.55-296.005 27.031l72.908-89.471 116.55-25.163-95.139-9.511 60.462-61.562 68.824-15.077-54.422-16.117 54.422-98.176-77.41 86.828-29.893-42.183 10.523 69.648-53.917 60.782-24.993-76.9v102.268z","Ground":"M112.764 439.754C112.625 439.754 112.528 439.617 112.574 439.486L243.289 70.134C243.318 70.0537 243.394 70 243.479 70H383.021C383.106 70 383.183 70.0541 383.211 70.1349L511.987 439.487C512.032 439.618 511.935 439.754 511.797 439.754H116.692H112.764ZM0.201306 441.199C0.0609122 441.199 -0.0362852 441.059 0.0129607 440.928L97.3526 181.056C97.3821 180.977 97.4571 180.925 97.541 180.925H182.118C182.258 180.925 182.355 181.064 182.307 181.195L88.1823 441.067C88.1535 441.146 88.0779 441.199 87.9932 441.199H0.201306Z","Ice":"M384.304 39.0418L385.879 177.392L265.209 235.319L263.721 104.69L384.304 39.0418ZM505.269 257.047L385.814 325.374L266.288 256.939L385.752 194.187L505.269 257.047ZM245.04 257.047L125.585 325.374L6.05861 256.939L125.523 194.187L245.04 257.047ZM124.243 38.4753L248.229 99.881L245.059 233.697L127.993 175.719L124.243 38.4753ZM387.678 473.525L263.692 412.119L266.862 278.302L383.928 336.281L387.678 473.525ZM128.525 474.77L126.949 336.42L247.62 278.493L249.108 409.121L128.525 474.77Z","Normal":"M481 256C481 380.264 380.264 481 256 481C131.736 481 31 380.264 31 256C31 131.736 131.736 31 256 31C380.264 31 481 131.736 481 256ZM384.571 256C384.571 327.008 327.008 384.571 256 384.571C184.992 384.571 127.429 327.008 127.429 256C127.429 184.992 184.992 127.429 256 127.429C327.008 127.429 384.571 184.992 384.571 256Z","Poison":"M427.821 393.449C479.524 352.108 512 292.376 512 225.95C512 101.161 397.385 0 256 0C114.615 0 0 101.161 0 225.95C0 289.978 30.1737 347.786 78.6553 388.901C75.7171 399.046 74.1052 410.081 74.1052 421.62C74.1052 471.535 104.267 512 141.474 512C165.65 512 186.852 494.915 198.737 469.254C210.622 494.915 231.824 512 256 512C278.038 512 297.604 497.804 309.895 475.857C322.186 497.804 341.752 512 363.789 512C400.996 512 431.158 471.535 431.158 421.62C431.158 411.784 429.986 402.314 427.821 393.449ZM404.211 230.431C404.211 293.785 336.346 345.144 252.632 345.144C168.917 345.144 101.053 293.785 101.053 230.431C101.053 167.077 168.917 115.718 252.632 115.718C336.346 115.718 404.211 167.077 404.211 230.431Z","Psychic":"M455.925 425.184C455.925 425.184 391.365 476.963 262.893 455.536C165.423 439.279 113.437 331.833 113.437 274.079C113.437 137.149 214.783 105.988 283.3 105.988C351.816 105.988 396.513 172.788 396.513 224.508C396.513 276.228 359.933 321.466 303.006 321.466C246.08 321.466 229.22 281.501 229.22 244.758C229.22 208.016 258.947 195.071 286.058 195.071C313.169 195.071 322.452 218.217 322.452 238.11C322.452 258.004 307.017 265.128 294.143 265.128C281.269 265.128 279.996 258.633 275.069 251.807C270.141 244.982 281.353 219.146 262.893 219.146C244.433 219.146 240.992 248.847 240.992 248.847C240.992 248.847 247.722 306.18 303.006 305.191C358.291 304.201 384.518 261.461 376.896 219.146C369.274 176.83 328.207 131.865 256.133 140.951C184.059 150.037 154.632 222.861 167.603 300.685C180.574 378.51 273.807 423.602 347.112 407.379C420.418 391.156 493.429 338.086 493.429 203.533C493.429 68.9789 376.896 -11.9002 237.941 1.42913C98.9859 14.7584 12.729 136.242 18.2502 282.207C23.7714 428.172 162.275 507.669 279.394 511.766C396.513 515.864 468.312 448.067 468.312 448.067C468.312 448.067 484.459 433.668 478.128 422.424C471.798 411.18 455.925 425.184 455.925 425.184Z","Rock":"M395.138 244.757C395.109 244.717 395.097 244.667 395.105 244.618L427.769 54.1518C427.784 54.0641 427.861 54 427.949 54H438.287C438.367 54 438.437 54.0517 438.461 54.1277L512.051 287.131C512.074 287.203 512.049 287.283 511.989 287.33L457.73 329.693C457.649 329.756 457.532 329.74 457.471 329.657L395.138 244.757ZM-1 371.022C-1 371.101 -0.949204 371.171 -0.874109 371.196L110.975 407.767C111.029 407.785 111.089 407.776 111.136 407.744L361.145 235.144C361.187 235.115 361.215 235.07 361.222 235.02L388.032 55.1284C388.049 55.018 387.963 54.9188 387.852 54.9188H166.406C166.351 54.9188 166.3 54.943 166.265 54.9849L-0.957974 256.714C-0.98514 256.747 -1 256.788 -1 256.831V371.022ZM157.583 417.085L279.776 457.112C279.831 457.13 279.892 457.121 279.939 457.087L425.418 352.734C425.499 352.677 425.519 352.566 425.464 352.484L370.928 271.329C370.871 271.244 370.757 271.222 370.673 271.28L157.583 417.085Z","Steel":"M0.0511107 254.527C-0.0170046 254.411 -0.0170388 254.267 0.0510196 254.15L128.795 34.1843C128.862 34.0702 128.985 34 129.117 34H384.294C384.427 34 384.55 34.0708 384.617 34.1859L511.949 254.152C512.016 254.267 512.016 254.41 511.949 254.525L384.617 474.244C384.55 474.359 384.427 474.43 384.294 474.43H129.117C128.985 474.43 128.862 474.36 128.795 474.246L0.0511107 254.527ZM374.617 254.215C374.617 319.703 321.528 372.792 256.04 372.792C190.552 372.792 137.463 319.703 137.463 254.215C137.463 188.726 190.552 135.638 256.04 135.638C321.528 135.638 374.617 188.726 374.617 254.215Z","Water":"M422.172 346.515C422.172 437.897 347.813 511.977 256.086 511.977C164.359 511.977 90 437.897 90 346.515C90 257.639 247.102 13.5479 255.718 0.22781C255.915 -0.0759384 256.258 -0.0759358 256.454 0.227813C265.07 13.5479 422.172 257.639 422.172 346.515ZM228.4 458.931C144.12 440.49 158.542 347.13 158.542 347.13C158.542 347.13 181.556 403.488 237.405 421.744C293.253 439.999 360.745 413.225 360.745 413.225C360.745 413.225 312.68 477.371 228.4 458.931Z"};
const typeIconSvg = tp => `<svg viewBox="0 0 512 512" class="ticonsvg" aria-hidden="true"><path d="${TYPE_SVG[tp]||""}"/></svg>`;
const TYPE_COLOR = {
  Normal:"#b8bec9", Fire:"#ff8a4c", Water:"#59a8ff", Electric:"#ffd93d", Grass:"#6ede6a",
  Ice:"#7fe4e6", Fighting:"#ff6b6b", Poison:"#c07bff", Ground:"#e0b26a", Flying:"#9fb8ff",
  Psychic:"#ff7bc0", Bug:"#a8c93a", Rock:"#c9a86a", Ghost:"#8f7bff", Dragon:"#6b8cff",
  Dark:"#8a7f9c", Steel:"#a8b8c9", Fairy:"#ffa4e0"
};
const GRAD = { 6:"linear-gradient(96deg,#ffd76a,#ff9de2)", 5:"linear-gradient(96deg,#9dff6a,#5ce1ff)", 4:"linear-gradient(96deg,#8fb8ff,#c9a2ff)" };

/* ---------- tiny storage (F27..F40 all persist through this) ---------- */
const LS = {
  get(k, d){ try { const v = localStorage.getItem("meza."+k); return v === null ? d : JSON.parse(v); } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem("meza."+k, JSON.stringify(v)); } catch(e){} }
};

let ROSTER = [], POOL = [], BOSSES = [], CHART = {}, TYPES = [];
let state  = { tab:"binder", q:"", type:null, grade:null, sort:"pe", boss:null, bfilter:"", safe:false };
let pstate = { q:"", type:null, mode:"missing", series:"1-3" };
let ALLSETS = false;
let SEL = new Set();                                /* F5  binder compare selection */
let COMPARE = [];                                  /* F8  boss compare bench */
let TEAM = LS.get("team", [null, null, null]);     /* legacy saved teams */
let SAVED_TEAMS = LS.get("teams", []);             /* F24 */
let WISH = LS.get("wish", []);                     /* F16 */
let LOG = LS.get("log", []);                       /* F27 */
let SETTINGS = LS.get("set", { ve:"en", dim:false });
let SESSION = LS.get("session", null);             /* F32 */
let OWNED = {};                                    /* name -> copies owned */

/* ---------- F33 Vietnamese interface ---------- */
const STR = {
 en:{ tb:"My Binder", tc:"Boss Counter", tl:"Team Lab", th:"Hunt List", ts:"Stats & Tools",
     sq:"Search my tags by name, id or type…", sbq:"Type the boss you just met… (kyurem, koraidon, skele)",
     pick:"Your pick", alts:"Also works", avoid:"Leave in the bag", plan:"Battle plan",
     logw:"Log win", logl:"Log loss", compare:"Compare", clear:"Reset", wish:"Wishlist",
     missing:"Missing", dupes:"Dupes", all:"All", vn:"VN", club:"Club", mag:"Magazine", event:"Event", owned:"owned", want:"want",
     stats:"Collection stats", coverage:"Type coverage", grade:"Grade breakdown", triggers:"Triggers held",
     streak:"Current streak", winrate:"Win rate", budget:"Budget planner", guide:"Tactics guide",
     export:"Export data", imp:"Import", reset:"Reset all", tips:"Pro tip" },
 vi:{ tb:"Bộ Sưu Tập", tc:"Chống Boss", tl:"Xây Đội", th:"Danh Sách Săn", ts:"Thống Kê & Công Cụ", tt:"Vé Hỗ Trợ",
      sq:"Tìm tag theo tên, mã, hệ…", sbq:"Gõ tên boss vừa gặp… (kyurem, koraidon, skele)", tq:"Tìm vé hỗ trợ theo tên, chiêu thức, nguồn…",
      pick:"Tag nên dùng", alts:"Cũng dùng được", avoid:"Cất vào túi", plan:"Kế hoạch đấu",
      logw:"Thắng", logl:"Thua", compare:"So sánh", clear:"Đặt lại", wish:"Muốn có",
      missing:"Chưa có", dupes:"Trùng", all:"Tất Cả", vn:"VN", club:"CLB", mag:"Tạp Chí", event:"Sự Kiện",
      owned:"đã có", want:"muốn", stats:"Thống kê bộ sưu tập", coverage:"Độ phủ hệ", grade:"Phân bố sao", triggers:"Triệu hồi đang có",
      streak:"Chuỗi thắng", winrate:"Tỉ lệ thắng", budget:"Tính ngân sách", guide:"Cẩm nang chiến thuật",
      export:"Xuất dữ liệu", imp:"Nhập", reset:"Xóa hết", tips:"Mẹo" }
};
const t = k => (STR[SETTINGS.ve] && STR[SETTINGS.ve][k]) || STR.en[k] || k;

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pill = tp => `<span class="pill" style="background:${TYPE_COLOR[tp]||"#9aa"};color:#080b17">${tp}</span>`;
const stars = g => "★".repeat(Math.max(0, Math.min(6, parseInt(g||0)))) || "";
const fmtDate = ts => new Date(ts).toLocaleDateString();

function offMult(attTypes, bossTypes){
  let best = 0;
  for (const a of attTypes){ let m = 1; for (const b of bossTypes) m *= (CHART[a]?.[b] ?? 1); if (m > best) best = m; }
  return best;
}
function incomingMult(bossTypes, mine){
  let best = 0;
  for (const b of bossTypes) for (const d of mine) best = Math.max(best, CHART[b]?.[d] ?? 1);
  return best || 1;
}
/* per boss MOVE type: product over the tag's defensive types (catches 4x quads) */
function incMoveMult(bossTypes, mine){
  let best = 1;
  for (const bt of bossTypes){
    let m = 1;
    for (const d of mine) m *= (CHART[bt]?.[d] ?? 1);
    best = Math.max(best, m);
  }
  return best;
}
const coveredTypes = team => TYPES.filter(bt => team.some(m => offMult(m.types, [bt]) >= 2));
const teamPE = team => team.reduce((s,m) => s + (m ? m.pe : 0), 0);

/* ================= BINDER ================= */
function renderChips(){
  const present = [...new Set(ROSTER.flatMap(x => x.types))].sort();
  $("#typeChips").innerHTML = `<span class="chip ${!state.type?"on":""}" data-t="">All types</span>` +
    present.map(tp => `<span class="chip ${state.type===tp?"on":""}" data-t="${tp}" style="${state.type===tp?`background:${TYPE_COLOR[tp]}`:""}">${tp}</span>`).join("");
  $("#typeChips").querySelectorAll(".chip").forEach(c => c.onclick = () => { state.type = c.dataset.t || null; renderChips(); renderGrid(); });
  /* F1 grade filter */
  $("#gradeChips").innerHTML = [null,6,5,4].map(g =>
    `<span class="chip g ${state.grade===g?"on":""}" data-g="${g??""}">${g===null?"All stars":g+"★"}</span>`).join("");
  $("#gradeChips").querySelectorAll(".chip").forEach(c => c.onclick = () => {
    state.grade = c.dataset.g === "" ? null : +c.dataset.g; renderChips(); renderGrid(); });
}
function filtered(){
  const q = state.q.trim().toLowerCase();
  let list = ROSTER.filter(x => {
    if (state.type && !x.types.includes(state.type)) return false;
    if (state.grade && +x.grade !== state.grade) return false;          /* F1 */
    if (!q) return true;
    return (x.name + " " + x.id + " " + x.types.join(" ") + " " + x.tier + " " + x.ability).toLowerCase().includes(q);
  });
  if (state.sort === "name") list.sort((a,b) => a.name.localeCompare(b.name));
  else if (state.sort === "dense") list.sort((a,b) => (b.pe/Math.max(2,b.beats.length)) - (a.pe/Math.max(2,a.beats.length))); /* F44 PE density */
  else list.sort((a,b) => b.pe - a.pe);
  return list;
}
function dupeNames(){
  const c = {}; ROSTER.forEach(x => c[x.name] = (c[x.name]||0)+1);
  return new Set(Object.keys(c).filter(n => c[n] > 1));
}
function renderGrid(){
  const list = filtered(), dupes = dupeNames();
  $("#cmpBar").style.display = SEL.size ? "flex" : "none";
  $("#cmpCount").textContent = SEL.size;
  if (!list.length){ $("#grid").innerHTML = `<div class="empty">No tag matches that.</div>`; return; }
  $("#grid").innerHTML = list.map((x,i) => `
    <article class="card ${SEL.has(x.id)?"sel":""}" data-id="${esc(x.id)}" style="--glow:${(TYPE_COLOR[x.types[0]]||"#7aa2ff")}66">
      <div class="halo"></div>
      <div class="pe">PE ${x.pe}</div>
      <div class="stars">${stars(x.grade)}</div>
      ${x.sprite ? `<img class="s2d ${x.animated?"":"still"}" src="${x.sprite}" alt="${esc(x.name)}" loading="lazy">` : (x.img ? `<img src="${x.img}" alt="${esc(x.name)}" loading="lazy">` : "")}
      <button class="selbtn" title="Compare">${SEL.has(x.id)?"⚖":"+"}</button>
      <div class="cname">${esc(x.name)}</div>
      <div class="cid">${esc(x.id)}${x.ability?" · "+esc(x.ability):""}</div>
      <div class="pills">${x.types.map(pill).join("")}</div>
      ${dupes.has(x.name) ? `<span class="dupe">DUPLICATE</span>` : ""}
    </article>`).join("");
  $("#grid").querySelectorAll(".card").forEach(c => {
    c.onclick = () => openTag(c.dataset.id);
    const b = c.querySelector(".selbtn");
    b.onclick = ev => { ev.stopPropagation();                                  /* F5 */
      SEL.has(c.dataset.id) ? SEL.delete(c.dataset.id) : SEL.add(c.dataset.id);
      renderGrid(); };
  });
}
/* F5 compare my tags */
function openCompareModal(){
  const items = [...SEL].map(id => ROSTER.find(x => x.id === id)).filter(Boolean);
  if (items.length < 2){ flashNote("#grid", "Pick at least two tags with the + button."); return; }
  const cov = coveredTypes(items);
  const rows = ["pe","grade","id"].map(k => `<tr><th>${k==="pe"?"PE":k==="grade"?"Stars":"ID"}</th>${items.map(x => `<td>${k==="pe"?x.pe:k==="grade"?(stars(x.grade)||"-"):esc(x.id)}</td>`).join("")}</tr>`).join("")
    + `<tr><th>2x into</th>${items.map(x => `<td>${x.beats.length?x.beats.join(", "):"-"}</td>`).join("")}</tr>`
    + `<tr><th>Weak to</th>${items.map(x => `<td>${x.weak.length?x.weak.join(", "):"-"}</td>`).join("")}</tr>`;
  $("#modal").innerHTML = `
    <button class="close" id="x">×</button>
    <div class="mherow">
      ${items.map(x => `<div class="cmpcol"><div class="mart" style="background:radial-gradient(circle at 50% 20%,${(TYPE_COLOR[x.types[0]]||"#7aa2ff")}33,transparent 70%),rgba(255,255,255,.05)">
        ${x.img ? `<img src="${x.img}" alt="">` : ""}</div>
        <h3 class="hname" style="font-size:17px">${esc(x.name)}</h3><div class="pills">${x.types.map(pill).join("")}</div></div>`).join("")}
    </div>
    <div class="sect"><h3>Head to head</h3><table class="mtable">${rows}</table></div>
    <div class="sect"><h3>Together they cover</h3><div class="tagsin">${cov.map(x => `<span class="tin" style="background:${TYPE_COLOR[x]}">${x}</span>`).join("") || `<span class="hint">Nothing at 2x.</span>`}</div>
      <div class="hint" style="margin-top:8px">Combined PE ${teamPE(items)} · ${cov.length} of 18 boss types covered.</div></div>`;
  $("#scrim").classList.add("on");
  $("#x").onclick = closeModal;
}
function flashNote(sel, msg){
  const host = document.querySelector(sel); if (!host) return;
  const d = document.createElement("div");
  d.className = "note warn"; d.textContent = msg; d.style.margin = "10px 0";
  host.prepend(d); setTimeout(() => d.remove(), 2600);
}

/* ================= TAG MODAL ================= */
function openTag(id){
  const x = ROSTER.find(z => z.id === id) || ROSTER[0];
  /* F2 bosses in the V2 pool this tag hits for 2x or 4x */
  const prey = BOSSES.filter(b => b.vn && offMult(x.types, b.types) >= 2)
                     .sort((a,b) => offMult(x.types,b.types) - offMult(x.types,a.types) || (b.pe||0)-(a.pe||0)).slice(0,6);
  /* F3 pool tags that cover this tag's weak spots */
  const coverors = POOL.filter(p => OWNED[p.name] ? false : p.beats.some(bt => x.weak.includes(bt)))
                       .sort((a,b) => b.pe - a.pe).slice(0,4);
  /* F4 fragility + quad warnings */
  const quads = TYPES.filter(bt => { let m = 1; for (const d of x.types) m *= (CHART[bt]?.[d] ?? 1); return m >= 4; });
  const partners = ROSTER.filter(o => o.name !== x.name && o.types.some(z => !x.types.includes(z))).slice(0,3);
  $("#modal").innerHTML = `
    <button class="close" id="x">×</button>
    <div class="mherow">
      <div class="mart" style="background:radial-gradient(circle at 50% 20%,${(TYPE_COLOR[x.types[0]]||"#7aa2ff")}33,transparent 70%),rgba(255,255,255,.05)">
              ${x.img ? `<img src="${x.img}" alt="${esc(x.name)}">` : ""}
            </div>
            ${x.sprite ? `<div class="mart spriteart"><img class="s2d ${x.animated?"":"still"}" src="${x.sprite}" alt="${esc(x.name)}"></div>` : ""}
            <div class="minfo">
        <div class="role">${esc(x.tier || "Tag")} · Grade ${esc(x.grade||"?")}</div>
        <h2 class="hname">${esc(x.name)}</h2>
        <div class="ptypes">${x.types.map(pill).join("")}</div>
        <div class="kv">
          <div><span>Poké Energy</span><b>${x.pe}</b></div>
          <div><span>Tag ID</span><b>${esc(x.id)}</b></div>
          <div><span>Grade</span><b>${stars(x.grade) || "-"}</b></div>
          <div><span>Ability</span><b>${esc(x.ability || "not listed")}</b></div>
          <div><span>PE density</span><b>${(x.pe/Math.max(2,x.beats.length)).toFixed(0)}</b></div>
          <div><span>Weak types</span><b>${x.weak.length}</b></div>
        </div>
      </div>
    </div>
    ${x.pdx ? `<div class="sect pokedex"><h3>Pokédex · #${x.pdx.dex}</h3>
      <div class="pdxf">${(x.pdx.height_m!=null?`<span class="pdxc">↕ ${x.pdx.height_m} m</span>`:"")}${(x.pdx.weight_kg!=null?`<span class="pdxc">⚖ ${x.pdx.weight_kg} kg</span>`:"")}${x.pdx.genus?`<span class="pdxc">${esc(x.pdx.genus)}</span>`:""}</div>
      ${x.pdx.flavor?`<p class="pdxt">${esc(x.pdx.flavor)}</p>`:""}
      ${(x.pdx.abilities||[]).length?`<div class="ptypes" style="margin-top:6px">${x.pdx.abilities.map(a=>`<span class="tin">${esc(a)}</span>`).join("")}</div>`:""}
    </div>` : ""}
    ${x.moves ? `<div class="sect"><h3>Moves</h3><div class="hint">${esc(x.moves)}</div></div>` : ""}
    <div class="sect"><h3>Hits bosses for double damage</h3>
      <div class="tagsin">${x.beats.length ? x.beats.map(z => `<span class="tin" style="background:${TYPE_COLOR[z]}">${z} 2x</span>`).join("") : `<span class="hint">No super effective coverage.</span>`}</div>
    </div>
    ${prey.length ? `<div class="sect"><h3>Bosses it punishes (V2 machines)</h3>
      ${prey.map(b => `<div class="route"><img src="${b.img}" alt=""><div><div class="rn">${esc(b.name)}</div><div class="rs">${esc(b.types.join(" / "))}</div></div>
        <div class="badge" style="background:${offMult(x.types,b.types)>=4?GRAD[6]:GRAD[5]}">${offMult(x.types,b.types)}x</div></div>`).join("")}</div>` : ""}
    <div class="sect"><h3>Careful: takes double damage from</h3>
      <div class="tagsin">${x.weak.length ? x.weak.map(z => `<span class="tin" style="background:${TYPE_COLOR[z]}">${z}</span>`).join("") : `<span class="hint">Nothing hits it for 2x.</span>`}</div>
    </div>
    ${quads.length ? `<div class="note bad">Quad danger: ${quads.join(", ")} hit this tag for 4x. Never field it into those bosses.</div>` : ""}
    ${x.resist.length ? `<div class="sect"><h3>Resists</h3><div class="tagsin">${x.resist.map(z => `<span class="tin" style="background:${TYPE_COLOR[z]}">${z}</span>`).join("")}</div></div>` : ""}
    ${x.weak.length >= 5 ? `<div class="note warn">Fragile: ${x.weak.length} types hit it for double. Field it only when the boss cannot punish it.</div>` : ""}
    ${x.weak.length <= 1 ? `<div class="note good">Very safe tag${x.weak.length ? ", only "+x.weak[0]+" threatens it" : ""}. A good opener.</div>` : ""}
    ${coverors.length ? `<div class="sect"><h3>Hunt these to cover its weak spots</h3>
      ${coverors.map(p => `<div class="route"><img src="${p.img}" alt=""><div><div class="rn">${esc(p.name)}</div><div class="rs">PE ${p.pe} · ${esc(p.types.join(" / "))} · covers ${p.beats.filter(bt => x.weak.includes(bt)).join(", ")}</div></div>
        <button class="mini heart ${WISH.includes(p.id)?"on":""}" data-w="${esc(p.id)}">${WISH.includes(p.id)?"♥":"♡"}</button></div>`).join("")}</div>` : ""}
    <div class="sect"><h3>Pairs well with</h3>
      ${partners.map(p => `<div class="route"><img src="${p.img}" alt=""><div><div class="rn">${esc(p.name)}</div><div class="rs">PE ${p.pe} · ${esc(p.types.join(" / "))}</div></div></div>`).join("")}
    </div>`;
  $("#scrim").classList.add("on");
  $("#x").onclick = closeModal;
  $("#modal").querySelectorAll("[data-w]").forEach(b => b.onclick = () => toggleWish(b.dataset.w, b));
}
function closeModal(){ $("#scrim").classList.remove("on"); }
$("#scrim")?.addEventListener?.("click", e => { if (e.target.id === "scrim") closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ================= BOSS COUNTER ================= */
function bossList(){ return ALLSETS ? BOSSES : BOSSES.filter(b => b.vn); }
function lev(a, b){
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 3) return 99;
  let prev = Array.from({length:n+1}, (_,i) => i), cur = new Array(n+1);
  for (let i = 1; i <= m; i++){
    cur[0] = i;
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}
function resolveBoss(q){
  const s = (q||"").trim().toLowerCase(); if (!s) return null;
  const L = BOSSES;   /* typo tolerance across every set, results stay VN aware */
  return L.find(b => b.name.toLowerCase() === s)
      || L.find(b => b.name.toLowerCase().startsWith(s))
      || L.find(b => b.name.toLowerCase().includes(s))
      || L.filter(b => lev(s, b.name.toLowerCase()) <= (s.length > 5 ? 2 : 1))
          .sort((x,y) => lev(s, x.name.toLowerCase()) - lev(s, y.name.toLowerCase()))[0]
      || null;
}
function routeRow(x, mult, sub){
  return `<div class="route"><img src="${x.img}" alt="">
    <div><div class="rn">${esc(x.name)}</div><div class="rs">${sub}</div></div>
    <div class="badge" style="background:${mult>=4?GRAD[6]:GRAD[5]}">${mult ? mult+"x" : "PE"}</div></div>`;
}
function byName(n){ return ROSTER.find(x => x.name === n) || ROSTER[0]; }
function teamMembers(){ return TEAM.map(i => i === null ? null : ROSTER.find(x => x.id === i)).filter(Boolean); }
/* ================= MAIN ROSTER ================= */
const MAIN_IDS = [
  /* ---- V1 buys (2026-09-30) ---- */
  "1-1-005",                       /* Tyranitar 6★ PE144 */
  "1-1-013",                       /* Umbreon 5★ PE112 */
  /* ---- V1 case ---- */
  "1-1-023", "1-1-002",            /* Inteleon, Mew */
  /* ---- V2 case + buys ---- */
  "1-2-010", "1-2-007",            /* Kyurem, Gardevoir */
  "1-2-015", "1-2-016", "1-2-019", "1-2-023", /* Lucario(Mega), Torterra(Mega), A.Ninetales(Mega), Appletun */
  "1-2-025", "1-2-014", "1-2-018", /* Drednaw, Sylveon, Empoleon */
  "1-2-012", "1-2-022",            /* Espeon, Flapple */
  "1-2-021",                       /* Metagross 5★ PE132 (buy) */
  "1-2-002",                       /* Groudon 6★ PE152 (buy) */
  /* ---- V3 case ---- */
  "1-3-014", "1-3-016", "1-3-022"  /* Chandelure, Nidoqueen, Regice */
];
function scoreVsType(members, btype){
  const defTypes = [btype];
  return members.map(x => {
    const st = bestStrike(x, defTypes);
    const inc = incMoveMult(defTypes, x.types);
    const mult = st.dmg / Math.max(1, x.pe || 100);
    let s = 0;
    if (mult >= 4) s += 6; else if (mult >= 2) s += 4;
    s += Math.min(st.statMod * 10, 4);
    s += st.effBonus;
    if (st.gimmick) s += 0.8;
    if (inc >= 4) s -= 7; else if (inc >= 2) s -= 2.5;
    if (inc < 1) s += 1.5;
    if (/Dynamax|Mega|Z[- ]?Move|TAG/i.test(x.trigger || x.tier || "")) s += 0.8;
    return { x, o: mult, inc, s, dmg: st.dmg, mvName: st.mvName };
  }).sort((a,b) => (b.s - a.s) || (b.dmg - a.dmg));
}
function trioVsType(members, btype){
  const rows = scoreVsType(members, btype);
  const safe = rows.filter(r => r.inc < 2);
  const pool = safe.length ? safe : rows;
  const lead = pool.slice().sort((a,b) => (a.inc - b.inc) || (b.s - a.s))[0];
  const rest = rows.filter(r => r.x.id !== lead.x.id);
  const main = rest.slice().sort((a,b) => (b.o - a.o) || ((b.x.pe||0) - (a.x.pe||0)) || (a.inc - b.inc))[0];
  const flex = rest.filter(r => r.x.id !== main.x.id)[0];
  return [lead, main, flex].filter(Boolean);
}
function renderRosterTypes(members){
  const el = $("#rosterTypes"); if (!el) return;
  el.innerHTML = TYPES.map(tp =>
    `<button class="ticon ${state.rcType===tp?"on":""}" data-tp="${tp}" title="${tp}" aria-label="${tp}"
      style="background:${TYPE_COLOR[tp]}${state.rcType===tp?"":"55"};box-shadow:${state.rcType===tp?`0 0 0 2px ${TYPE_COLOR[tp]}, 0 0 14px ${TYPE_COLOR[tp]}66`:"none"}">${typeIconSvg(tp)}</button>`).join("");
  el.querySelectorAll(".ticon").forEach(c => c.onclick = () => {
    state.rcType = state.rcType === c.dataset.tp ? null : c.dataset.tp;
    renderRosterTypes(members); renderTypeCounter(members);
  });
}
function renderTypeCounter(members){
  const el = $("#typeCounter"); if (!el) return;
  if (!state.rcType){
    el.innerHTML = `<div class="hint">Bấm 1 huy hiệu hệ phía trên — I will pick the 3 strongest tags from your case for that fight.</div>`;
    return;
  }
  const tp = state.rcType;
  const trio = trioVsType(members, tp);
  const role = i => i === 0 ? "1 · LEAD" : i === 1 ? "2 · MAIN DAMAGE" : "3 · FLEX";
  const why = r => {
    const bits = [];
    bits.push(r.o >= 4 ? `${r.o}xx damage` : r.o >= 2 ? `${r.o}xx damage` : "no type bonus (PE power)");
    if (r.inc >= 4) bits.push("⚠ boss hits it 4x — emergency only");
    else if (r.inc >= 2) bits.push(`⚠ takes 2x from ${tp}`);
    else if (r.inc < 1) bits.push(`resists ${tp}`);
    if (/Dynamax/i.test(r.x.tier || "")) bits.push("Dynamax ready");
    if (/Mega/i.test(r.x.tier || "")) bits.push("Mega ready");
    if (/Z[- ]?Move/i.test(r.x.tier || "")) bits.push("Z-Move once");
    return bits.join(" · ");
  };
  el.innerHTML = `
    <div class="role" style="margin:4px 0 8px">Your 3 strongest vs <span style="color:${TYPE_COLOR[tp]}">${tp}</span></div>
    <div class="setrow">${trio.map((r,i) => `
      <div class="setcard glass"><img src="${r.x.img}" alt="">
        <div><div class="rn">${esc(r.x.name)} <span style="color:var(--gold)">${r.x.pe ? "PE "+r.x.pe : "PE ?"}</span></div>
        <div class="rs hint">${esc(r.x.types.join(" / "))}</div>
        <div class="rs" style="color:var(--gold)">${role(i)}</div>
        <div class="rs ${r.inc>=2?"bad":"ok"}">${why(r)}</div></div></div>`).join("")}</div>`;
  const cov = coveredTypes(members.filter(m => trio.some(t => t.x.id === m.id)));
  const warn = members.filter(m => incMoveMult([tp], m.types) >= 4).map(m => m.name);
  el.innerHTML += `
    ${warn.length ? `<div class="note bad" style="margin-top:8px">Never field vs ${tp}: ${warn.join(", ")} (4x weak). ${trio.some(t=>warn.includes(t.x.name))?"":"Your trio is safe."}</div>` : `<div class="note good" style="margin-top:8px">Nobody in your case is 4x weak to ${tp}. Full trio safe to slide.</div>`}
    <div class="hint" style="margin-top:6px">Trio coverage: ${cov.length} of 18 boss types hit for 2x. ${trio.every(t=>t.o>=2) ? "All three hit "+tp+" for super damage (move-based)." : trio[0].o>=2 ? "Lead carries the super damage here." : "No super-effective option — lead with PE power."}</div>`;
}
function mainMembers(){
  return MAIN_IDS.map(id => {
    const r = ROSTER.find(x => x.id === id), p = POOL.find(x => x.id === id);
    if (!r && !p) return null;
    return Object.assign({}, p || {}, r || {});      /* pool has moves+stats for ALL; roster carries ownership/hero art */
  }).filter(Boolean);
}
/* best single tag in the main roster vs a target tag (types + PE + danger) */

/* ==== move-based damage (v30 data: moves have real types) ==== */
function moveMult(moveType, defTypes){
  let m = 1;
  for (const b of (defTypes || [])) m *= (CHART[moveType] && CHART[moveType][b]) || 1;
  return m;
}
/* best strike of a member vs target - considers EVERY stat on the tag:
   PE, all moves (+types+effects), gimmick move, Atk/SpA (mash power),
   HP+Def+SpD (bulk), Speed, trigger */
function bestStrike(x, defTypes){
  let dmg = (x.pe || 100), mvName = "(no move data)", effBonus = 0, gimmick = false;
  const atkPower = Math.max(x.atk || 0, x.spa || 0);
  for (const mv of (x.moves || [])){
    if (!mv || !mv.type) continue;
    let d = (x.pe || 100) * moveMult(mv.type, defTypes);
    if (mv.gimmick){ d *= 1.5; gimmick = true; }          /* Z/Dmax move: once per battle but huge */
    if (d > dmg){ dmg = d; mvName = mv.name; }
  }
  /* SURVIVAL CHECK vs the specific enemy (Khanh rule: no need to be a
     wall, just survive the boss's strikes). Estimate every hit the boss
     throws (its move1 + move2, type mults vs OUR types). */
  let survival = null;
  if (defTypes && defTypes._boss){
    const boss = defTypes._boss;
    const ehp = (x.hp || 100) + Math.min(x.dfn || 100, x.spd || 100);
    let worst = 0, worstMv = "";
    for (const bm of [boss.move1, boss.move2].filter(Boolean)){
      if (!bm || !bm.type) continue;
      const d = (boss.pe || 100) * moveMult(bm.type, x.types);
      if (d > worst){ worst = d; worstMv = bm.name; }
    }
    survival = { ehp, worst, worstMv, ok: ehp > worst, spare: ehp - worst };
  }
  /* move effects from the sheet */
  const eff = (x.move_effect || "").toLowerCase();
  if (eff.includes("high crit")) effBonus += 0.5;
  if (eff.includes("2x damage to dynamax")) effBonus += 1;
  if (eff.includes("hits def")) effBonus += 0.3;
  /* stat shape: offense converts to roulette bonus damage, bulk keeps you alive */
  const bulk = (x.hp || 100) + (x.dfn || 100) * 0.6 + (x.spd || 100) * 0.6;
  const off = atkPower * 0.15 + (x.spe || 50) * 0.05;
  return { dmg, mvName, effBonus, gimmick, survival, statMod: (bulk + off) / 300 };
}
function bestVsTag(target){
  const bossStats = (window.STATS_BY_ID || {})[target.id] || null;
  const def = target.types.slice(); if (bossStats) def._boss = bossStats;
  const rows = mainMembers().map(x => {
    const st = bestStrike(x, def);
    const inc = incMoveMult(target.types, x.types);
    const mult = st.dmg / Math.max(1, x.pe || 100);
    let s = 0;
    if (mult >= 4) s += 6; else if (mult >= 2) s += 4;
    s += Math.min(st.statMod * 10, 4);                     /* generic stats capped - no wall-hunting */
    if (st.survival){
      if (st.survival.ok) s += 2 + Math.min(st.survival.spare / 50, 2);   /* survives boss's worst hit */
      else s -= 4 + Math.min(-st.survival.spare / 50, 4);                 /* dies to its big move: heavy penalty */
    }
    s += st.effBonus;
    if (st.gimmick) s += 0.8;
    if (inc >= 4) s -= 7; else if (inc >= 2) s -= 2.5;
    if (inc < 1) s += 1.5;
    if (/Dynamax|Mega|Z[- ]?Move|TAG/i.test(x.trigger || x.tier || "")) s += 0.8;
    return { x, dmg: st.dmg, mvName: st.mvName, inc, s, surv: st.survival };
  }).sort((a,b) => (b.s - a.s) || (b.dmg - a.dmg));
  return rows[0];
}
/* popup: tap a hunt-list tag -> best main-roster answer vs it */
function openCounterPopup(tag){
  const best = bestVsTag(tag);
  const x = best.x;
  const bits = [];
  const mult = best.dmg / Math.max(1, best.x.pe || 100);
  bits.push(`${best.mvName} — ${Math.round(best.dmg)} dmg (${mult}x vs this boss)`);
  if (best.surv){
    bits.push(best.surv.ok
      ? `🛡 survives ${best.surv.worstMv || "boss hits"} (spare ${Math.round(best.surv.spare)})`
      : `☠ DANGER: dies to ${best.surv.worstMv || "boss big hit"} (${Math.round(-best.surv.spare)} short)`);
  }
  if (best.inc >= 4) bits.push("⚠ it takes 4x back — emergency only");
  else if (best.inc >= 2) bits.push(`⚠ takes 2x from ${target.types.join("/")}`);
  else if (best.inc < 1) bits.push(`resists ${target.types.join("/")}`);
  if (/Dynamax/i.test(x.tier || "")) bits.push("Dynamax ready");
  if (/Mega/i.test(x.tier || "")) bits.push("Mega ready");
  if (/Z[- ]?Move/i.test(x.tier || "")) bits.push("Z-Move once");
  $("#modal").innerHTML = `
    <button class="close" id="x">×</button>
    <div class="glass hero" style="max-width:420px">
      <div class="role" style="margin-bottom:10px">Best answer from your Main Roster</div>
      <div class="setcard glass">
        ${tag.img ? `<img src="${tag.img}" alt="">` : ""}
        <div style="flex:1;min-width:150px">
          <div class="role">Target · hunt list</div>
          <div class="rn">${esc(tag.name)} <span style="color:var(--gold)">${tag.pe ? "PE "+tag.pe : "PE ?"}</span></div>
          <div class="pills">${tag.types.map(pill).join("")}</div>
        </div>
      </div>
      <div style="text-align:center;font-size:22px;margin:6px 0">⬇ beats ⬆</div>
      <div class="setcard glass" style="border-color:var(--gold)">
        ${x.img ? `<img src="${x.img}" alt="">` : ""}
        <div style="flex:1;min-width:150px">
          <div class="role" style="color:var(--gold)">Play this</div>
          <div class="rn">${esc(x.name)} <span style="color:var(--gold)">${x.pe ? "PE "+x.pe : "PE ?"}</span></div>
          <div class="pills">${x.types.map(pill).join("")}</div>
          <div class="rs hint" style="margin-top:4px">${bits.join(" · ")}</div>
        </div>
      </div>
      <div class="note good" style="margin-top:8px">Slide it in when the gauge is charged. One trigger (Dynamax/Mega/Z) per battle — fire it when the boss is below half.</div>
    </div>`;
  $("#scrim").classList.add("on");
  $("#x").onclick = closeModal;
}
function renderLoadout(){
  const el = $("#loadout");
  const members = MAIN_IDS.map(id => ROSTER.find(x => x.id === id) || POOL.find(x => x.id === id)).filter(Boolean);
  const dyn = members.filter(x => /Dynamax/i.test(x.tier || "") || /Dynamax/i.test(x.ability || ""));
  const zm  = members.filter(x => /Z[- ]?Move/i.test(x.tier || "") || /Z[- ]?Move/i.test(x.ability || ""));
  const mega= members.filter(x => /Mega/i.test(x.tier || "") || /Mega/i.test(x.ability || ""));
  const totalPE = members.reduce((s,x) => s + (x.pe || 0), 0);
  const cov = coveredTypes(members);
  const card = (x, role, why) => `
    <article class="card pool owned" style="--glow:${(TYPE_COLOR[x.types[0]]||"#7aa2ff")}44">
      <div class="halo"></div>
      <div class="roletag">${role}</div>
      ${x.img ? `<img src="${x.img}" alt="${esc(x.name)}" loading="lazy">` : ""}
      <div class="cname">${esc(x.name)}</div>
      <div class="cid">${esc(x.id)}${x.pe ? " · PE "+x.pe : ""}</div>
      <div class="pills">${x.types.map(pill).join("")}</div>
      <div class="hint" style="margin-top:4px">${why}</div>
    </article>`;
  const lead = ["Empoleon","Kyurem","Lucario"].map(n => members.find(x => x.name === n)).filter(Boolean);
  el.innerHTML = `
    <div class="glass hero">
      <div class="role" style="margin-bottom:8px">Pick a boss type · get your 3 strongest</div>
      <div class="chips" id="rosterTypes" style="margin-bottom:10px"></div>
      <div id="typeCounter"></div>
      <div class="role" style="margin:10px 0 8px">Main Roster · the case you bring to the arcade</div>
      <div class="hint" style="margin-bottom:8px">${members.length} tags · total PE ${totalPE} · covers ${cov.length} of 18 boss types${dyn.length?" · Dynamax: "+dyn.map(x=>x.name).join(", "):""}${zm.length?" · Z-Move: "+zm.map(x=>x.name).join(", "):""}${mega.length?" · Mega: "+mega.map(x=>x.name).join(", "):""}</div>
      <div class="sect"><h3>Opening trio (unknown boss)</h3></div>
      <div class="setrow">${lead.map(x => `
        <div class="setcard glass"><img src="${x.img}" alt="">
          <div><div class="rn">${esc(x.name)} <span style="color:var(--gold)">PE ${x.pe}</span></div>
          <div class="rs hint">${x.name==="Empoleon"?"Lead · Water/Steel Mega, resists half the type chart":x.name==="Kyurem"?"Closer · highest PE 156, keep away from Dragon/Fighting/Fairy bosses":"Flex · Mega, unlocks Fighting Steel Ice Rock Dark Fairy"}</div>
          <div class="pills">${x.types.map(pill).join("")}</div></div></div>`).join("")}</div>
      <div class="note good">Lead Empoleon to build the gauge safely (Mega when worn), Kyurem drops for the big damage, Lucario flexes into whatever is left. Vs Dragon bosses lead Sylveon or Alolan Ninetales instead.</div>
    </div>
    <div class="sect"><h3 style="font-family:'Chakra Petch';letter-spacing:.14em;color:var(--muted);font-size:12px;text-transform:uppercase;margin:10px 2px">Full roster · ${members.length} tags</h3></div>
    <div class="grid">${members.map(x => {
      const isLead = lead.some(l => l.id === x.id);
      const why = isLead ? "Opening trio" : x.id === "1-3-016" ? "Dynamax holder (V3)" : x.id === "1-3-014" ? "Z-Move one-shot per session (V3)" : x.id === "1-3-022" ? "V3 Star · PE not measured yet" : /Mega/i.test(x.tier||"") ? "Mega holder" : (x.pe||0) >= 115 ? "High PE damage" : "Coverage / backup";
      return card(x, isLead ? "⭐ LEAD" : x.id === "1-3-016" ? "🔺 DYNAMAX" : x.id === "1-3-014" ? "⚡ Z-MOVE" : x.name === "Kyurem" ? "💎 CLOSER" : "◆", why);
    }).join("")}</div>`;
  state.rcType = state.rcType || null;
  renderRosterTypes(members); renderTypeCounter(members);
}

/* ================= HUNT LIST ================= */
function toggleWish(id, btn){
  const i = WISH.indexOf(id);
  if (i >= 0) WISH.splice(i, 1); else WISH.push(id);
  LS.set("wish", WISH);
  if (btn){ btn.textContent = WISH.includes(id) ? "♥" : "♡"; btn.classList.toggle("on", WISH.includes(id)); }
  if (state.tab === "hunt") renderPoolGrid();
}
function poolFiltered(){
  const q = pstate.q.trim().toLowerCase();
  let list = POOL.filter(p => {
    const ser = (p.id || "").split("-").slice(0, p.id && p.id.startsWith("R-") ? 2 : 2).join("-");
    if (pstate.series === "R") { if (!/^R-/.test(p.id)) return false; }
    else if (pstate.series && !String(p.id).startsWith(pstate.series + "-")) return false;
    if (pstate.type && !p.types.includes(pstate.type)) return false;
    if (!q) return true;
    return (p.name + " " + p.id + " " + p.types.join(" ")).toLowerCase().includes(q);
  });
  if (pstate.mode === "missing") list = list.filter(p => !OWNED[p.name]);
  else if (pstate.mode === "dupes") list = list.filter(p => OWNED[p.name] > 1);
  else if (pstate.mode === "wish") list = list.filter(p => WISH.includes(p.id));
  return list;
}
function renderSeriesChips(){
  const el = $("#seriesChips"); if (!el) return;
  const defs = [
    ["1-3", "⭐ V3 · ACTIVE (hunt these)"],
    ["R", "🎟 Regular"],
    ["1-1", "V1 · retired"],
    ["1-2", "V2 · retired"],
    ["", "All series"]
  ];
  el.innerHTML = defs.map(([v, label]) =>
    `<span class="chip ${pstate.series===v?"on":""}" data-s="${v}">${label}</span>`).join("");
  el.querySelectorAll(".chip").forEach(c => c.onclick = () => { pstate.series = c.dataset.s; renderSeriesChips(); renderPoolGrid(); });
}
function renderPoolChips(){
  const present = [...new Set(POOL.flatMap(p => p.types))].sort();
  $("#poolTypeChips").innerHTML = `<span class="chip ${!pstate.type?"on":""}" data-t="">All</span>` +
    present.map(tp => `<span class="chip ${pstate.type===tp?"on":""}" data-t="${tp}" style="${pstate.type===tp?`background:${TYPE_COLOR[tp]}`:""}">${tp}</span>`).join("");
  $("#poolTypeChips").querySelectorAll(".chip").forEach(c => c.onclick = () => { pstate.type = c.dataset.t || null; renderPoolChips(); renderPoolGrid(); });
}
function renderPoolGrid(){
  const list = poolFiltered();
  $("#huntCount").textContent = `${list.length} tag${list.length===1?"":"s"}`;
  if (!list.length){ $("#pgrid").innerHTML = `<div class="empty">Nothing here. ${pstate.mode==="missing"?"You own the whole filter.":""}</div>`; return; }
  $("#pgrid").innerHTML = list.map((p,i) => {
    const own = OWNED[p.name] || 0;
    return `<article class="card pool ${own?"owned":""}" data-hunt="${esc(p.id)}" style="--glow:${(TYPE_COLOR[p.types[0]]||"#7aa2ff")}44;cursor:pointer">
      <div class="halo"></div>
      <div class="pe">${p.pe ? "PE "+p.pe : "PE ?"}</div>
      <div class="stars">${stars(p.grade)}</div>
      ${p.img ? `<img src="${p.img}" alt="${esc(p.name)}" loading="${i<8?"eager":"lazy"}">` : ""}
      <button class="mini heart ${WISH.includes(p.id)?"on":""}" data-w="${esc(p.id)}">${WISH.includes(p.id)?"♥":"♡"}</button>
      ${own ? `<span class="ownbadge">✔ ${own} ${t("owned")}</span>` : `<span class="ownbadge no">not owned</span>`}
      <div class="cname">${esc(p.name)}</div>
      <div class="cid">${esc(p.id)}${p.tier?" · "+esc(p.tier):""}</div>
      <div class="pills">${p.types.map(pill).join("")}</div>
    </article>`; }).join("");
  $("#pgrid").querySelectorAll("[data-w]").forEach(b => b.onclick = ev => { ev.stopPropagation(); toggleWish(b.dataset.w, b); });
  $("#pgrid").querySelectorAll("[data-hunt]").forEach(c => c.onclick = ev => {
    if (ev.target.closest("[data-w]")) return;
    const tag = POOL.find(z => z.id === c.dataset.hunt);
    if (tag) openCounterPopup(tag);
  });
}
/* F14 completion + F18 gap advisor + F19 ladder + F22 PE per type */
function renderHuntSummary(){
  const total = POOL.length, owned = POOL.filter(p => OWNED[p.name]).length;
  const pct = Math.round(owned / total * 100);
  const covOwned = new Set(ROSTER.flatMap(x => x.types));
  const gaps = TYPES.filter(tp => !covOwned.has(tp));
  const fixers = {};
  gaps.forEach(tp => { fixers[tp] = POOL.filter(p => !OWNED[p.name] && p.types.includes(tp)).sort((a,b) => (b.pe||0) - (a.pe||0)).slice(0,2); });
  $("#huntSummary").innerHTML = `
    <div class="glass hero">
      <div class="role">Stardust completion</div>
      <div class="covmeter"><div class="covbar" style="width:${pct}%"></div></div>
      <div class="hint"><b>${owned} of ${total}</b> unique tags owned · ${pct}% · ${ROSTER.length - owned > 0 ? ROSTER.length - owned + " extra copies" : "no spares"}</div>
      ${gaps.length ? `<div class="sect"><h3>Type gaps in your binder</h3>
        ${gaps.map(tp => `<div class="route"><div style="flex:1"><div class="rn">${tp} <span class="rs">· nothing you own hits it 2x</span></div>
          <div class="rs">${(fixers[tp]||[]).map(f => `${esc(f.name)} PE ${f.pe}`).join(" · ") || "no V2 tag covers this type"}</div></div>
          ${(fixers[tp]||[])[0] ? `<button class="mini heart ${WISH.includes(fixers[tp][0].id)?"on":""}" data-w="${esc(fixers[tp][0].id)}">${WISH.includes(fixers[tp][0].id)?"♥":"♡"}</button>` : ""}</div>`).join("")}
        <div class="note warn" style="margin-top:6px">Bug has no tag in Stardust V2 at all. Poison only Mareanie PE54. Those two gaps are machine facts, not bad luck.</div></div>` : ""}
      <div class="sect"><h3>PE ladder · top of the set</h3>
        ${POOL.slice(0,6).map((p,i) => `<div class="route"><img src="${p.img}" alt=""><div><div class="rn">${i+1}. ${esc(p.name)}${OWNED[p.name]?" <span style='color:var(--lime)'>✔</span>":""}</div><div class="rs">${esc(p.types.join(" / "))} · ${esc(p.tier||"")}</div></div><div class="badge" style="background:${GRAD[6]}">${p.pe}</div></div>`).join("")}
      </div>
    </div>`;
  $("#huntSummary").querySelectorAll("[data-w]").forEach(b => b.onclick = () => toggleWish(b.dataset.w, b));
}

/* ================= STATS & TOOLS ================= */
const TIPS = [
 "Kill the boss on turn 2, not turn 3. Rotating bosses fast is how you meet 6★ tags.",
 "The machine holds roughly one 6★ per 14 tags dropped. Budget about 14 gets per gold.",
 "Roulette is aimable: tap as the needle enters the high zone, not when it is on it.",
 "Get Time always catches one of the three. Extra coin only if the shown tag is worth it.",
 "Master Ball roulette appears most when the whole field is 5★ or 6★. Hunt in good lobbies.",
 "One Dynamax, one Mega, one Z Move per session. Carrying two Z Move tags wastes a slot.",
 "Snorlax only fears Fighting. It is your safest lead into an unknown boss.",
 "Kyurem is your cannon but drops to 7 types. Keep it for the turn the boss is already weak.",
 "Duplicate tags are trade stock. Keep the higher PE copy visible when trading.",
 "Turn the money you were going to spend on a risky get into one more boss rotation instead."
];
function renderStats(){
  const host = $("#statsBox"); if (!host) return;
  const wins = LOG.filter(e => e.win).length;
  const st = streaks();
  const byType = {};
  ROSTER.forEach(x => x.types.forEach(tp => { byType[tp] = byType[tp] || []; byType[tp].push(x); }));
  const typeRows = TYPES.map(tp => (byType[tp]||[])).map((arr,tp) => ({ tp, n: arr.length, pe: arr.reduce((s,x) => s+x.pe, 0) })).filter(r => r.n);
  const grades = [6,5,4,3,2].map(g => ({ g, n: ROSTER.filter(x => +x.grade === g).length })).filter(r => r.n);
  const trig = { "Dynamax": [], "Mega": [], "Z Move": [] };
  ROSTER.forEach(x => { const s = (x.tier||"") + " " + (x.ability||""); if (/dynamax/i.test(s)) trig["Dynamax"].push(x); if (/mega/i.test(s)) trig["Mega"].push(x); if (/z.?move/i.test(s)) trig["Z Move"].push(x); });
  const owned = POOL.filter(p => OWNED[p.name]).length;
  const ach = [
    ["First blood", LOG.length >= 1], ["Ten battles logged", LOG.length >= 10],
    ["Win streak 3", st.best >= 3], ["Half the set", owned >= POOL.length/2],
    ["Full type floor", new Set(ROSTER.flatMap(x => x.types)).size >= 12],
    ["6★ owner", ROSTER.some(x => +x.grade === 6)],
    ["Wishlist curator", WISH.length >= 3], ["Team architect", SAVED_TEAMS.length >= 1]
  ];
  const tip = TIPS[Math.floor(Date.now() / 86400000) % TIPS.length];
  $("#tipLine").innerHTML = `<b>${t("tips")}:</b> ${tip}`;
  host.innerHTML = `
    <div class="glass hero"><div class="role">${t("stats")}</div>
      <div class="statgrid">
        <div class="stat"><b>${ROSTER.length}</b><span>tags owned</span></div>
        <div class="stat"><b>${ROSTER.reduce((s,x) => s+x.pe, 0)}</b><span>total PE</span></div>
        <div class="stat"><b>${Math.round(ROSTER.reduce((s,x) => s+x.pe, 0) / Math.max(1,ROSTER.length))}</b><span>avg PE</span></div>
        <div class="stat"><b>${owned}/${POOL.length}</b><span>V2 unique</span></div>
        <div class="stat"><b>${dupeNames().size}</b><span>dupe names</span></div>
        <div class="stat"><b>${st.cur}</b><span>${t("streak")}</span></div>
        <div class="stat"><b>${LOG.length ? Math.round(wins/LOG.length*100) : 0}%</b><span>${t("winrate")}</span></div>
        <div class="stat"><b>${LOG.length}</b><span>battles logged</span></div>
      </div>
      <div class="actrow" style="margin-top:10px">
        <button class="btn" id="veBtn">🌐 ${SETTINGS.ve === "en" ? "Tiếng Việt" : "English"}</button>
        <button class="btn ${SETTINGS.dim?"act":""}" id="dimBtn">🔋 Battery saver</button>
        <button class="btn" id="logClear">🧹 Clear log</button>
      </div>
    </div>
    <div class="glass hero"><div class="role">${t("coverage")}</div>
      <div class="covcheck">${TYPES.map(tp => { const hit = ROSTER.some(x => offMult(x.types,[tp]) >= 2);
        return `<span class="covcell ${hit?"ok":"no"}" style="${hit?`background:${TYPE_COLOR[tp]}`:""}">${tp}</span>`; }).join("")}</div>
      <div class="hint" style="margin-top:6px">${coveredTypes(ROSTER).length} of 18 boss types take 2x from something you own.</div>
    </div>
    <div class="glass hero"><div class="role">${t("grade")}</div>
      ${grades.map(g => `<div class="bargrp"><span class="bl">${g.g}★</span><div class="bar"><div style="width:${Math.round(g.n/ROSTER.length*100)}%;background:${GRAD[g.g]||GRAD[4]}"></div></div><span class="bv">${g.n}</span></div>`).join("")}
    </div>
    <div class="glass hero"><div class="role">PE by type</div>
      ${typeRows.sort((a,b) => b.pe - a.pe).map(r => `<div class="bargrp"><span class="bl">${r.tp}</span><div class="bar"><div style="width:${Math.round(r.pe/typeRows[0].pe*100)}%;background:${TYPE_COLOR[r.tp]}"></div></div><span class="bv">${r.pe}</span></div>`).join("")}
    </div>
    <div class="glass hero"><div class="role">${t("triggers")}</div>
      ${Object.entries(trig).map(([k,v]) => `<div class="route"><div style="flex:1"><div class="rn">${k}</div>
        <div class="rs">${v.length ? v.map(x => esc(x.name)).join(", ") : "none in the binder"}</div></div>
        <div class="badge" style="background:${v.length?GRAD[5]:"rgba(255,255,255,.1)"}">${v.length}</div></div>`).join("")}
      <div class="hint" style="margin-top:6px">One of each per session. Snorlax holds Dynamax, Lucario holds Mega, Torterra or Empoleon hold the Z Move.</div>
    </div>
    <div class="glass hero"><div class="role">${t("budget")}</div>
      <div class="kv">
        <div><span>VND per game</span><input id="creditCost" type="number" value="10000" step="1000"></div>
        <div><span>Budget (VND)</span><input id="budgetVnd" type="number" value="200000" step="50000"></div>
      </div>
      <div id="budgetOut" class="hint" style="margin-top:10px"></div>
    </div>
    <div class="glass hero"><div class="role">Session money tracker</div>
      <div class="actrow">
        <button class="btn act" id="sessStart">▶ Start session</button>
        <button class="btn" id="sessAdd">+1 game</button>
        <button class="btn" id="sessEnd">■ End</button>
      </div>
      <div id="sessOut" class="hint" style="margin-top:10px"></div>
    </div>
    <div class="glass hero"><div class="role">Roulette trainer</div>
      <div class="roul" id="roul"><div class="needle"></div></div>
      <div class="actrow"><button class="btn act" id="roulGo">▶ Spin</button><span class="hint" id="roulOut" style="align-self:center"></span></div>
    </div>
    <div class="glass hero"><div class="role">Golden turn planner</div>
      <div class="kv"><div><span>Boss HP left (%)</span><input id="ghp" type="number" value="50" min="5" max="100" step="5"></div>
        <div><span>Best mult seen</span><input id="gmul" type="number" value="2" min="1" max="4" step="0.5"></div></div>
      <div id="goldOut" class="hint" style="margin-top:10px"></div>
    </div>
    <div class="glass hero"><div class="role">Achievements</div>
      ${ach.map(([n,done]) => `<div class="achv ${done?"done":""}"><span>${done?"🏆":"🔒"}</span> ${n}</div>`).join("")}
    </div>
    <div class="glass hero"><div class="role">${t("guide")}</div>
      <details class="gdetails"><summary>How a 100 VND game flows</summary><div class="hint">Pick an area, fight 3 enemies. Slide a tag to attack, mash the button to charge, stop the roulette on a high number. Beat the boss, pay for Get Time at the ball roulette, one catch is guaranteed.</div></details>
      <details class="gdetails"><summary>Boss rotation for 6★</summary><div class="hint">Clear both sidekicks on turn 1, kill the boss on turn 2. The next boss spawns without another coin, so more bosses per credit means more 6★ sightings. Do not stretch a losing game for one extra turn.</div></details>
      <details class="gdetails"><summary>Ball tiers</summary><div class="hint">Normal Ball 2★ to 3★ gets · Great Ball 4★ · Ultra Ball 5★ · Master Ball 6★. The ball roulette rises with a stronger field: keep 5★ and 6★ tags on the field in Get Time.</div></details>
      <details class="gdetails"><summary>Real machine odds</summary><div class="hint">Inside the machine: 8 tag tubes of 50 with 3 to 5 six stars at the bottom of each, so roughly one 6★ per 14 tags dispensed. Expect dry spells of 10+ gets and do not chase with extra coins.</div></details>
      <details class="gdetails"><summary>Trigger discipline</summary><div class="hint">Dynamax, Mega and Z Move are once per session each. Fire a trigger only when the multiplier is already 2x or the boss is under half HP, otherwise you waste the ceiling.</div></details>
    </div>
    <div class="glass hero"><div class="role">Data</div>
      <div class="actrow">
        <button class="btn" id="expBtn">⬇ ${t("export")}</button>
        <button class="btn" id="impBtn">⬆ ${t("imp")}</button>
        <button class="btn danger" id="resetBtn">⚠ ${t("reset")}</button>
      </div>
      <textarea id="ioBox" class="iobox" placeholder="Export puts your backup here. Import pastes one back." spellcheck="false"></textarea>
    </div>
    <div class="glass hero"><div class="role">This build</div>
      <div class="hint">Mega update · <b>50 functions</b> added in one pass.<details class="gdetails" style="margin-top:8px"><summary>See all 50</summary>
      <ol class="featlist">${FEATURES.map(f => `<li>${f}</li>`).join("")}</ol></details></div>
      <div class="hint" style="margin-top:8px">Install to home screen for offline use: Safari Share → Add to Home Screen, or Chrome ⋮ → Install app.</div>
    </div>`;
  $("#veBtn").onclick = () => { SETTINGS.ve = SETTINGS.ve === "en" ? "vi" : "en"; LS.set("set", SETTINGS); applyLang(); renderStats(); };
  $("#dimBtn").onclick = () => { SETTINGS.dim = !SETTINGS.dim; LS.set("set", SETTINGS); document.body.classList.toggle("dim", SETTINGS.dim); renderStats(); };
  $("#logClear").onclick = () => { LOG = []; LS.set("log", LOG); renderStats(); };
  $("#creditCost").oninput = $("#budgetVnd").oninput = renderBudget;
  renderBudget(); renderSession(); renderRoulette(); renderGold();
  $("#sessStart").onclick = () => { SESSION = { start: Date.now(), games: 0 }; LS.set("session", SESSION); renderSession(); };
  $("#sessAdd").onclick = () => { if (!SESSION) SESSION = { start: Date.now(), games: 0 }; SESSION.games++; LS.set("session", SESSION); renderSession(); };
  $("#sessEnd").onclick = () => { if (SESSION){ LOG.push({ boss:"session", pick:"-", win:true, ts:Date.now(), note:`${SESSION.games} games` }); LS.set("log", LOG); } SESSION = null; LS.set("session", null); renderSession(); renderStats(); };
  $("#roulGo").onclick = spinRoulette;
  $("#ghp").oninput = $("#gmul").oninput = renderGold;
  $("#expBtn").onclick = () => { $("#ioBox").value = JSON.stringify({ wish:WISH, log:LOG, teams:SAVED_TEAMS, team:TEAM, set:SETTINGS, session:SESSION }); $("#ioBox").select(); };
  $("#impBtn").onclick = () => {
    try {
      const d = JSON.parse($("#ioBox").value);
      if (d.wish) { WISH = d.wish; LS.set("wish", WISH); }
      if (d.log) { LOG = d.log; LS.set("log", LOG); }
      if (d.teams) { SAVED_TEAMS = d.teams; LS.set("teams", SAVED_TEAMS); }
      if (d.team) { TEAM = d.team; LS.set("team", TEAM); }
      if (d.set) { SETTINGS = d.set; LS.set("set", SETTINGS); }
      renderStats(); renderLoadout(); renderPoolGrid(); flashNote("#statsBox", "Imported ✔");
    } catch(e){ flashNote("#statsBox", "That is not a valid backup."); } };
  $("#resetBtn").onclick = () => {
    if (!confirm("Delete wishlist, log, teams and settings? This cannot be undone.")) return;
    ["wish","log","teams","team","set","session"].forEach(k => localStorage.removeItem("meza."+k));
    WISH = []; LOG = []; SAVED_TEAMS = []; TEAM = [null,null,null]; SESSION = null; SETTINGS = { ve:"en", dim:false };
    renderStats(); renderLoadout(); renderPoolGrid();
  };
}
/* F30/F31 budget */
function renderBudget(){
  const out = $("#budgetOut"); if (!out) return;
  const cost = Math.max(1000, +$("#creditCost").value || 10000);
  const bud = Math.max(0, +$("#budgetVnd").value || 0);
  const games = Math.floor(bud / cost);
  const tags = Math.round(games * 0.75);            /* ~3 gets per 4 coins with Get Time */
  const six = (games / 14).toFixed(1);
  const perSix = Math.round(cost * 14 / 1000) * 1000;
  out.innerHTML = `Budget <b>${bud.toLocaleString()} VND</b> at <b>${cost.toLocaleString()}</b> per game → about <b>${games} games</b>, <b>~${tags} tags</b>.<br>
    Expected 6★ tags: <b>${six}</b> · long run cost per 6★ ≈ <b>${perSix.toLocaleString()} VND</b>.<br>
    <span style="color:var(--dim)">Walk away when the budget is gone. The tubes do not remember your streak.</span>`;
}
/* F32 session tracker */
function renderSession(){
  const out = $("#sessOut"); if (!out) return;
  if (!SESSION){ out.innerHTML = "No session running."; return; }
  const mins = Math.round((Date.now() - SESSION.start) / 60000);
  out.innerHTML = `Started ${fmtDate(SESSION.start)} · <b>${SESSION.games} games</b> · ${mins} min in${SESSION.games ? ` · avg ${Math.round(mins/SESSION.games)} min/game` : ""}.`;
}
/* F34 roulette trainer */
let roulAnim = null;
function renderRoulette(){
  const r = $("#roul"); if (!r) return;
  r.innerHTML = `<div class="needle"></div>` + Array.from({length:24}, (_,i) =>
    `<span class="rz ${[2,3,10,11,18,19].includes(i)?"hi":""}">${[2,3,10,11,18,19].includes(i)?"2x":"1x"}</span>`).join("");
}
function spinRoulette(){
  const r = $("#roul"), out = $("#roulOut"); if (!r) return;
  if (roulAnim) clearInterval(roulAnim);
  let off = 0, speed = 26 + Math.random() * 10;
  roulAnim = setInterval(() => {
    off = (off + speed) % 100;
    r.style.setProperty("--off", off + "%");
    speed *= 0.972;
    if (speed < 0.35){
      clearInterval(roulAnim); roulAnim = null;
      const zone = Math.floor(off / (100/24)) % 24;
      const hit = [2,3,10,11,18,19].includes(zone);
      out.innerHTML = hit ? "✔ landed in a 2x zone. Keep that timing." : "✖ 1x zone. Try tapping a beat earlier.";
      out.style.color = hit ? "var(--lime)" : "var(--hot)";
    }
  }, 30);
}
/* F36 golden turn planner */
function renderGold(){
  const out = $("#goldOut"); if (!out) return;
  const hp = Math.min(100, Math.max(5, +$("#ghp").value || 50));
  const mul = Math.max(1, +$("#gmul").value || 2);
  const burst = Math.round(mul * (hp <= 50 ? 2 : 1) * 100);
  out.innerHTML = `At <b>${hp}%</b> boss HP with a <b>${mul}x</b> roulette, your burst window is worth about <b>${burst}</b> damage units.
   ${hp <= 50 ? "Boss under half: fire your one Dynamax/Mega/Z Move now, this is the golden turn." : "Hold the trigger until the boss is under half, then combine it with the roulette peak."}
   ${hp <= 25 ? "Finish now: overkill damage is wasted damage, save the trigger for the next boss." : ""}`;
}
function applyLang(){
  document.querySelectorAll("nav.tabs button").forEach(b => {
    b.textContent = t(b.dataset.tab === "binder" ? "tb" : b.dataset.tab === "load" ? "tl" : b.dataset.tab === "hunt" ? "th" : "ts"); });
  const q = $("#q"); if (q) q.placeholder = t("sq");
  document.querySelectorAll(".drawer .dlink[data-tab]").forEach(b => {
    b.lastChild.textContent = " " + t(b.dataset.tab === "binder" ? "tb" : b.dataset.tab === "load" ? "tl" : b.dataset.tab === "hunt" ? "th" : "ts"); });
}

/* ================= SUPPORT TICKETS ================= */
const TICKETS = [
  { id:"t1", name:"Zygarde", form:"Complete Forme", move:"Thousand Arrows", type:["Ground","Dragon"], grade:5,
    source:"Mezastar Club (digital)", period:"2020-09-17 to ~2021-01", set:"Set 1", vn:false, img:"img/1-1-025_Zygarde.webp", qr:"img/support_ticket_1.png" },
  { id:"t2", name:"Flygon", move:"Earthquake", type:["Ground","Dragon"], grade:5,
    source:"Mezastar Club (digital)", period:"2021-04-22 to 2021-09-15", set:"Set 4", vn:false, img:"img/4-050_Flygon.webp", qr:"img/support_ticket_2.png" },
  { id:"t3", name:"Corviknight", move:"Brave Bird", type:["Flying","Steel"], grade:5,
    source:"Pokémon Fan magazine issue 73 (physical QR)", period:"2021-04-28 to 2021-09-15", set:"Set 4", vn:false, img:"img/4-046_Corviknight.webp", qr:"img/support_ticket_3.png" },
  { id:"t4", name:"Mimikyu", move:"Shadow Claw", type:["Ghost","Fairy"], grade:5,
    source:"Tournament prize (defeat Star Trainer Sakura)", period:"2021-04-22 to 2021-09-15", set:"Set 4", vn:false, img:"img/4-049_Mimikyu.webp", qr:"img/support_ticket_4.png" },
  { id:"t5", name:"Tangrowth", move:"Power Whip", type:["Grass"], grade:5,
    source:"Mezastar Club (digital)", period:"2022-09-15 to 2022-11-21", set:"Double Chain 2", vn:false, img:"", qr:"img/support_ticket_5.png" },
  { id:"t6", name:"Nidoking", move:"Earth Power", type:["Poison","Ground"], grade:5,
    source:"Mezastar Club (digital) + pamphlet + Pokémon Fan", period:"2023-02-09 to 2023-08-31", set:"Double Chain 4", vn:true, img:"img/dc4-025_Nidoking.webp", qr:"img/support_ticket_6.png" },
  { id:"t7", name:"Krookodile", move:"Earthquake", type:["Ground","Dark"], grade:5,
    source:"Mezastar Club (digital) + pamphlet + event", period:"2024-02-08 to 2024-04-30", set:"Gorgeous Star 4", vn:true, img:"", qr:"img/support_ticket_7.png" },
  { id:"t8", name:"Calyrex", form:"Ice Rider", move:"Glacial Lance", type:["Psychic","Ice"], grade:6,
    source:"Mezastar Club (digital)", period:"Super Tag 1 launch period", set:"Super Tag 1", vn:false, img:"img/st1-005_Calyrex_Ice.webp", qr:"img/support_ticket_8.png" },
  { id:"t9", name:"Calyrex", form:"Shadow Rider", move:"Astral Barrage", type:["Psychic","Ghost"], grade:6,
    source:"Physical launch campaign ticket", period:"Super Tag 1 launch", set:"Super Tag 1", vn:false, img:"img/st1-006_Calyrex_Shadow.webp", qr:"img/support_ticket_9.png" },
  { id:"t10", name:"Drifblim", move:"Shadow Ball", type:["Ghost","Flying"], grade:4,
    source:"Mezastar Club / event flyer", period:"Stardust V2 era (VN)", set:"Stardust V2", vn:true, img:"img/1-2-064_Drifblim.webp", qr:"img/support_ticket_10.png" },
  { id:"t11", name:"Skeledirge", move:"Torch Song", type:["Fire","Ghost"], grade:5,
    source:"Mezastar Club / event flyer", period:"Stardust V2 era (VN)", set:"Stardust V2", vn:true, img:"img/1-2-027_Skeledirge.webp", qr:"img/support_ticket_11.png" },
  { id:"t12", name:"Mareanie", move:"Toxic Spikes", type:["Poison","Water"], grade:2,
    source:"Mezastar Club / event flyer", period:"Stardust V2 era (VN)", set:"Stardust V2", vn:true, img:"img/1-2-065_Mareanie.webp", qr:"img/support_ticket_12.png" },
];

function ticketSrc(t){
  if (t.source.includes("Mezastar Club")) return "club";
  if (t.source.includes("magazine") || t.source.includes("Pokémon Fan")) return "mag";
  if (t.source.includes("Tournament")) return "event";
  if (t.source.includes("launch") || t.source.includes("flyer")) return "event";
  return "club";
}
function renderTickets(){
  const q = ($("#tq")?.value || "").trim().toLowerCase();
  const filter = (window.ticketFilter || "all");
  let list = TICKETS.filter(t => {
    const types = Array.isArray(t.type) ? t.type : [t.type].filter(Boolean);
    if (filter === "vn" && !t.vn) return false;
    if (filter === "club" && ticketSrc(t) !== "club") return false;
    if (filter === "mag" && ticketSrc(t) !== "mag") return false;
    if (filter === "event" && ticketSrc(t) !== "event") return false;
    if (!q) return true;
    return (t.name + " " + t.move + " " + t.set + " " + types.join(" ") + " " + t.source).toLowerCase().includes(q);
  });
  $("#ticketCount").textContent = `${list.length} ticket${list.length===1?"":"s"} · ${list.filter(t=>t.vn).length} available in Vietnam`;
  if (!list.length){ $("#tgrid").innerHTML = `<div class="empty">No tickets match that filter.</div>`; return; }
  $("#tgrid").innerHTML = list.map((t,i) => {
      const types = Array.isArray(t.type) ? t.type : [t.type].filter(Boolean);
      const firstType = types[0];
      return `
      <article class="card ticket" style="--glow:${(TYPE_COLOR[firstType]||"#7aa2ff")}44">
        <div class="halo"></div>
        <div class="stars">${stars(t.grade)}</div>
        ${t.img ? `<img src="${t.img}" alt="${esc(t.name)}" loading="${i<6?'eager':'lazy'}">` : ""}
        ${t.qr ? `<div class="qrimg"><img src="${t.qr}" alt="QR for ${esc(t.name)}" loading="${i<6?'eager':'lazy'}" class="qrcode"></div>` : ""}
        <div class="srcbadge ${ticketSrc(t)}">${ticketSrc(t).toUpperCase()}</div>
        ${t.vn ? `<div class="srcbadge vn">VN ✔</div>` : `<div class="srcbadge no-vn">VN ✕</div>`}
        <div class="cname">${esc(t.name)}${t.form?` ${t.form}`:""}</div>
        <div class="cid">${esc(t.set)}</div>
        <div class="pills">${types.map(pill).join("")}</div>
        <div class="move">Move: ${esc(t.move)}</div>
        <div class="hint" style="margin-top:4px">${esc(t.source)} · ${esc(t.period)}</div>
      </article>`;
    }).join("");
}

/* ================= wiring ================= */
function setDrawer(open){
  $("#drawer").classList.toggle("open", open);
  $("#navScrim").classList.toggle("open", open);
  $("#burgerBtn").classList.toggle("open", open);
  $("#burgerBtn").setAttribute("aria-expanded", open ? "true" : "false");
  $("#drawer").setAttribute("aria-hidden", open ? "false" : "true");
}
$("#burgerBtn").onclick = () => setDrawer(!$("#drawer").classList.contains("open"));
$("#navScrim").onclick = () => setDrawer(false);
document.addEventListener("keydown", e => { if (e.key === "Escape"){ closeModal(); setDrawer(false); } });
function tab(name){
  state.tab = name;
  document.querySelectorAll("nav.tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === name));
  document.querySelectorAll(".drawer .dlink[data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === name));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("on", p.id === "p-" + name));
  if (name === "stats") renderStats();
  if (name === "hunt"){ renderSeriesChips(); renderPoolChips(); renderPoolGrid(); renderHuntSummary(); }
  if (name === "tickets") renderTickets();
}
document.querySelectorAll("nav.tabs button").forEach(b => b.onclick = () => tab(b.dataset.tab));
document.querySelectorAll(".drawer .dlink[data-tab]").forEach(b => b.onclick = () => { tab(b.dataset.tab); setDrawer(false); });
$("#q").oninput = e => { state.q = e.target.value; renderGrid(); };
$("#sortBtn").onclick = () => { state.sort = "pe"; $("#sortBtn").classList.add("act"); $("#sortName").classList.remove("act"); $("#sortDense").classList.remove("act"); renderGrid(); };
$("#sortName").onclick = () => { state.sort = "name"; $("#sortName").classList.add("act"); $("#sortBtn").classList.remove("act"); $("#sortDense").classList.remove("act"); renderGrid(); };
$("#sortDense").onclick = () => { state.sort = "dense"; $("#sortDense").classList.add("act"); $("#sortBtn").classList.remove("act"); $("#sortName").classList.remove("act"); renderGrid(); };






$("#pq").oninput = e => { pstate.q = e.target.value; renderPoolGrid(); };
$("#tq").oninput = e => { renderTickets(); };
document.querySelectorAll("#huntModes .btn").forEach(b => b.onclick = () => {
  pstate.mode = b.dataset.m;
  document.querySelectorAll("#huntModes .btn").forEach(x => x.classList.toggle("act", x === b));
  renderPoolGrid(); });
document.querySelectorAll("#ticketFilters .btn").forEach(b => b.onclick = () => {
  window.ticketFilter = b.dataset.f;
  document.querySelectorAll("#ticketFilters .btn").forEach(x => x.classList.toggle("act", x === b));
  renderTickets(); });
$("#cmpGo").onclick = () => openCompareModal();
$("#cmpClear").onclick = () => { SEL.clear(); renderGrid(); };

(async function init(){
  try{
    const [ro, po, bo, tc, sst, spr, px] = await Promise.all([
          fetch("data/roster.json").then(r => r.json()),
          fetch("data/pool.json").then(r => r.json()),
          fetch("data/bosses.json").then(r => r.json()),
          fetch("data/typechart.json").then(r => r.json()),
          fetch("data/stats_allsets.json").then(r => r.json()).catch(() => []),
          fetch("island/data/sprites.json").then(r => r.json()).catch(() => ({})),
          fetch("island/data/pokedex.json").then(r => r.json()).catch(() => ({}))
        ]);
        ROSTER = ro.tags; POOL = po.tags; BOSSES = bo.bosses; CHART = tc.chart; TYPES = tc.types;
        window.STATS_BY_ID = {}; (sst || []).forEach(s => { if (s && s.id) window.STATS_BY_ID[s.id] = s; });
        /* 2D game sprite + Pokédex info per tag (matched by Pokémon name) */
        ROSTER.forEach(x => {
          const s = spr[x.name]; if (s){ x.sprite = "island/sprites/" + s.file; x.animated = !!s.animated; }
          const d = px[x.name]; if (d) x.pdx = d;
        });
    OWNED = {}; ROSTER.forEach(x => OWNED[x.name] = (OWNED[x.name]||0) + 1);
    TEAM = TEAM.map(id => id && ROSTER.some(x => x.id === id) ? id : null);
    $("#sCount").textContent = ROSTER.length;
    $("#sPe").textContent = ROSTER.reduce((s,x) => s + x.pe, 0);
    $("#sType").textContent = [...new Set(ROSTER.flatMap(x => x.types))].length;
    const quick = ["Kyurem","Koraidon","Reshiram","Zekrom","Kommo-o","Tyranitar","Metagross","Alolan Ninetales","Skeledirge","Drifblim","Leafeon","Infernape"];
            document.body.classList.toggle("dim", !!SETTINGS.dim);
        renderChips(); renderGrid(); renderLoadout();
        renderSeriesChips(); renderPoolChips(); renderPoolGrid(); renderHuntSummary(); renderStats();
        // translate ticket filter buttons
        document.querySelectorAll("#ticketFilters .btn[data-f]").forEach(b => {
          const key = b.dataset.f; b.textContent = t(key);
        });
      }catch(err){
        document.querySelectorAll(".spin").forEach(s => s.outerHTML = `<div class="empty">Could not load the binder data: ${err.message}</div>`);
      }
    })();

/* Installable on the phone home screen, and works offline once opened (art is cached). */
if ("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
