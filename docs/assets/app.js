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

let ROSTER = [], POOL = [], BOSSES = [], CHART = {}, TYPES = []; let MOVE_AR = {};  /* per-move attack roulette multipliers (MovesAR tab) */
let AR_WHEEL = {};   /* per-TAG Attack Roulette wheel {id:{w:[lo,mid,hi],max}} - data/ar_wheel.json */
let state  = { tab:"binder", q:"", type:null, grade:null, sort:"pe", boss:null, bfilter:"", safe:false };
let pstate = { q:"" };   /* hunt tab: only a boss-name filter */   /* grade null=all, "5", "6" */
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
  let best = 0;  /* 0 = fully immune to everything this enemy has - real advantage, never floor to 1 */
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
        </div>`).join("")}</div>` : ""}
    <div class="sect"><h3>Pairs well with</h3>
      ${partners.map(p => `<div class="route"><img src="${p.img}" alt=""><div><div class="rn">${esc(p.name)}</div><div class="rs">PE ${p.pe} · ${esc(p.types.join(" / "))}</div></div></div>`).join("")}
    </div>`;
  $("#scrim").classList.add("on");
  $("#x").onclick = closeModal;
  
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
  /* ==== THE SQUAD 11 (2026-10-02: brute-forced optimal over C(20,11)=167,960,
         beats all 70 V3 bosses, every boss has a surviving answer) ==== */
  "1-1-005",  /* Tyranitar 6★ PE144 - Lugia 432 / Ho-Oh 864 */
  "1-2-002",  /* Groudon 6★ PE152 - SPARE: tankiest, safe vs everything */
  "1-3-016",  /* Nidoqueen 5★ PE122 - Zeraora/Eternatus 366 (Dynamax) */
  "1-3-014",  /* Chandelure 5★ PE130 - Solgaleo 390 / Lunala 780 (Z-Move) */
  "1-1-013",  /* Umbreon 5★ PE112 - Lunala 448, zero-weakness shield */
  "1-2-016",  /* Torterra 5★ PE112 - Solgaleo 336 (Mega) */
  "1-1-002",  /* Mew 6★ PE142 - Keldeo 284, 109-across flex */
  "1-2-019",  /* A.Ninetales 5★ PE122 - Zygarde 732 (Ice Z) */
  "1-2-015",  /* Lucario 5★ PE118 - Greninja 236 (Mega) */
  "1-2-021",  /* Metagross 5★ PE132 - Grimmsnarl 396 */
  "1-2-023"   /* Appletun 5★ PE110 - Swampert 440 */
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
    const m = Object.assign({}, p || {}, r || {});   /* roster carries ownership/hero art */
    /* roster sometimes holds EMPTY moves [] - never let it blank out pool's real move data */
    if (m === r || (r && (!Array.isArray(m.moves) || !m.moves.length) && p && p.moves && p.moves.length)){
      m.moves = p.moves;
      ["hp","atk","dfn","spa","spd","spe","move_effect","gimmick","trigger","pe"].forEach(k => {
        if (m[k] === undefined || m[k] === null || m[k] === "" || (k !== "pe" && Array.isArray(m[k]) && !m[k].length)) m[k] = p[k];
      });
    }
    return m;
  }).filter(Boolean);
}
/* best single tag in the main roster vs a target tag (types + PE + danger) */

/* ==== move-based damage (v30 data: moves have real types) ==== */
function moveMult(moveType, defTypes){
  let m = 1;
  for (const b of (defTypes || [])) m *= (CHART[moveType] && CHART[moveType][b] !== undefined) ? CHART[moveType][b] : 1;  /* keeps 0x immunities - never || 1 */
  return m;
}
/* best strike of a member vs target - considers EVERY stat on the tag:
   PE, all moves (+types+effects), gimmick move, Atk/SpA (mash power),
   HP+Def+SpD (bulk), Speed, trigger */
function bestStrike(x, defTypes){
  let dmg = (x.pe || 100), mvName = "(immune — no move lands)", effBonus = 0, gimmick = false;
  const atkPower = Math.max(x.atk || 0, x.spa || 0);
  for (const mv of (x.moves || [])){
    if (!mv || !mv.type) continue;
    let d = strikeDmg(x, mv, defTypes).d;                 /* v62: shared damage formula */
    if (d > 0 && mv.gimmick) gimmick = true;
    if (d > dmg){ dmg = d; mvName = mv.name; }              /* keeps the PE floor for damage */
    else if (mvName === "(immune — no move lands)" && d > 0){ mvName = mv.name; }  /* still NAME the real move */
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
      let d = (boss.pe || 100) * moveMult(bm.type, x.types);
      const bar = MOVE_AR[bm.name];
      if (bar && bar.ar){ d *= (bar.ar / 100); }
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
function bestVsTagRows(target){
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
  return rows;
}
function bestVsTag(target){ return bestVsTagRows(target)[0]; }
/* popup: tap a hunt-list tag -> best main-roster answer vs it */
function openCounterPopup(tag){
  const rows = bestVsTagRows(tag);
  const best = rows[0], second = rows[1];
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
  else if (best.inc >= 2) bits.push(`⚠ takes 2x from ${tag.types.join("/")}`);
  else if (best.inc < 1) bits.push(`resists ${tag.types.join("/")}`);
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
          ${(window.STATS_BY_ID[tag.id] && window.STATS_BY_ID[tag.id].move1 && window.STATS_BY_ID[tag.id].move1.name) ? `<div class="rs hint" style="margin-top:4px">⚔ ${esc(window.STATS_BY_ID[tag.id].move1.name)}${window.STATS_BY_ID[tag.id].move1.type ? " ("+window.STATS_BY_ID[tag.id].move1.type+")" : ""}${window.STATS_BY_ID[tag.id].move2 && window.STATS_BY_ID[tag.id].move2.name ? ` · ⚔ ${esc(window.STATS_BY_ID[tag.id].move2.name)} (${window.STATS_BY_ID[tag.id].move2.type})` : ""}${window.STATS_BY_ID[tag.id].hp ? ` · HP ${window.STATS_BY_ID[tag.id].hp}` : ""}</div>` : ""}
        </div>
      </div>
      <div style="text-align:center;font-size:22px;margin:6px 0">⬇ beats ⬆</div>
      <div class="setcard glass" style="border-color:var(--gold)">
        ${x.img ? `<img src="${x.img}" alt="">` : ""}
        <div style="flex:1;min-width:150px">
          <div class="role" style="color:var(--gold)">Play this</div>
          <div class="rn">${esc(x.name)} <span style="color:var(--gold)">${x.pe ? "PE "+x.pe : "PE ?"}</span></div>
          <div class="pills">${x.types.map(pill).join("")}</div>
          ${(x.ability || (window.STATS_BY_ID[x.id] && window.STATS_BY_ID[x.id].move1 && window.STATS_BY_ID[x.id].move1.name)) ? `<div class="rs hint" style="margin-top:4px">${x.ability ? `✨ ${esc(x.ability)} · ` : ""}${x.moves && x.moves.length ? x.moves.map(m => `⚔ ${esc(m.name)}${m.type ? " ("+m.type+")" : ""}`).join(" · ") : (window.STATS_BY_ID[x.id].move1 ? `⚔ ${esc(window.STATS_BY_ID[x.id].move1.name)} (${window.STATS_BY_ID[x.id].move1.type})` : "")}</div>` : ""}
          <div class="rs hint" style="margin-top:4px">${bits.join(" · ")}</div>
        </div>
      </div>
      ${second ? `<div style="text-align:center;font-size:15px;margin:10px 0 4px;opacity:.75">🥈 second best</div>
      <div class="setcard glass" style="border-color:rgba(255,255,255,.25)">
        ${second.x.img ? `<img src="${second.x.img}" alt="" style="opacity:.92">` : ""}
        <div style="flex:1;min-width:150px">
          <div class="role">Backup option</div>
          <div class="rn">${esc(second.x.name)} <span style="color:var(--gold)">${second.x.pe ? "PE "+second.x.pe : "PE ?"}</span></div>
          <div class="pills">${second.x.types.map(pill).join("")}</div>
          <div class="rs hint" style="margin-top:4px">${second.mvName} — ${Math.round(second.dmg)} dmg${second.surv ? (second.surv.ok ? ` · 🛡 survives (${Math.round(second.surv.spare)} spare)` : ` · ☠ dies to ${second.surv.worstMv || "boss hit"}`) : ""}${second.inc >= 2 ? ` · ⚠ takes ${second.inc}x back` : ""}</div>
        </div>
      </div>` : ""}
      <div class="note good" style="margin-top:8px">Slide it in when the gauge is charged. One trigger (Dynamax/Mega/Z) per battle — fire it when the boss is below half.</div>
    </div>`;
  $("#scrim").classList.add("on");
  $("#x").onclick = closeModal;
}
/* ==== USER ROSTER (v53): additions persisted in localStorage; battle auto-includes ==== */
function userRoster(){ try { return JSON.parse(localStorage.getItem("userRoster") || "[]"); } catch(e){ return []; } }
function setUserRoster(ids){ localStorage.setItem("userRoster", JSON.stringify(ids)); }
function allRosterIds(){ return MAIN_IDS.concat(userRoster().filter(id => !MAIN_IDS.includes(id))); }

function renderLoadout(){
  const el = $("#loadout");
  const ids = allRosterIds();
  const members = ids.map(id => ROSTER.find(x => x.id === id) || POOL.find(x => x.id === id)).filter(Boolean);
  const card = (x) => `
    <article class="card pool owned" style="--glow:${(TYPE_COLOR[x.types[0]] || "#7aa2ff")}44">
      <div class="halo"></div>
      <button class="roremove" data-rm="${esc(x.id)}" title="Remove from roster">✕</button>
      ${x.img ? `<img src="${x.img}" alt="${esc(x.name)}" loading="lazy">` : ""}
      <div class="cname">${esc(x.name)}</div>
      <div class="cid">${esc(x.id)}${x.pe ? " · PE " + x.pe : ""}</div>
      <div class="pills">${x.types.map(pill).join("")}</div>
    </article>`;
  el.innerHTML = `
    <div class="rhead">
      <div class="rhead-l"><span class="btitle">🏆 Main Roster</span>
        <span class="hint" style="margin-left:10px">${members.length} tags · battle mode uses these</span></div>
      <button class="btn act" id="rosterAdd">＋ Add pokemon</button>
    </div>
    <div class="grid">${members.map(card).join("")}</div>`;
  el.querySelectorAll("[data-rm]").forEach(b => b.onclick = () => {
    const id = b.dataset.rm;
    const core = MAIN_IDS.includes(id);
    if (core){
      /* squad core cannot be removed from data, but user may hide it: store in overrides */
      const hid = JSON.parse(localStorage.getItem("rosterHidden") || "[]");
      if (!hid.includes(id)) hid.push(id);
      localStorage.setItem("rosterHidden", JSON.stringify(hid));
    } else {
      setUserRoster(userRoster().filter(x => x !== id));
    }
    invalidateCands(); renderLoadout();
  });
  const add = $("#rosterAdd"); if (add) add.onclick = rosterAddPicker;
}

/* add-pokemon picker: search full pool, tap to add to main roster */
function rosterAddPicker(){
  const el = $("#modal");
  const owned = new Set(ROSTER.map(x => x.id));
  const cands = POOL.filter(x => !allRosterIds().includes(x.id) && (owned.has(x.id) || (x.grade === "5" || x.grade === "6")))
    .sort((a, b) => (b.pe || 0) - (a.pe || 0));
  el.innerHTML = `<div class="modalhead">Add to Main Roster <button class="xbtn" id="x">✕</button></div>
    <input class="bsearch" id="bs" placeholder="Search pokemon…" autocomplete="off">
    <div class="plist" id="pl">${cands.map(x => `
      <button class="pitem" data-id="${esc(x.id)}">
        <span>${esc(x.name)}</span>
        <span class="psub">${(x.types || []).join("/")} · PE ${x.pe ?? "?"}${owned.has(x.id) ? " · owned" : ""}</span>
      </button>`).join("")}</div>`;
  $("#scrim").classList.add("on");
  $("#x").onclick = closeModal;
  $("#bs").oninput = e => {
    const q = e.target.value.trim().toLowerCase();
    $("#pl").innerHTML = cands.filter(x => !q || x.name.toLowerCase().includes(q) || String(x.id).includes(q)).map(x => `
      <button class="pitem" data-id="${esc(x.id)}">
        <span>${esc(x.name)}</span>
        <span class="psub">${(x.types || []).join("/")} · PE ${x.pe ?? "?"}${owned.has(x.id) ? " · owned" : ""}</span>
      </button>`).join("");
    wirePl();
  };
  const wirePl = () => el.querySelectorAll("[data-id]").forEach(b => b.onclick = () => {
    const ids = userRoster();
    if (!ids.includes(b.dataset.id)) ids.push(b.dataset.id);
    setUserRoster(ids);
    closeModal(); invalidateCands(); renderLoadout();
  });
  wirePl();
}

/* battle candidate cache must rebuild when roster changes */
function invalidateCands(){ BSC.clear(); CANDS.length = 0; buildCands(); }


function squadMembers(){
  return SQUAD11.map(id => ROSTER.find(x => x.id === id) || POOL.find(x => x.id === id)).filter(Boolean);
}
/* every V3 6-star/5-star boss + which squad tag answers it best */
function squadCoverage(){
  const bosses = POOL.filter(p => String(p.id).indexOf("1-3-") === 0 && (p.grade === "6" || p.grade === "5"));
  return bosses.map(b => {
    const rows = bestVsTagRows(b).filter(r => SQUAD11.indexOf(r.x.id) >= 0);
    rows.sort((a, c) => (c.s - a.s) || (c.dmg - a.dmg));
    return { boss: b, rows: rows };
  });
}
function renderSquad(){
  const el = $("#squadBox"); if (!el) return;
  const bosses = POOL.filter(p => String(p.id).indexOf("1-3-") === 0 && (p.grade === "6" || p.grade === "5"));
  const q = pstate.q.trim().toLowerCase();
  const list = bosses.filter(b => !q ||
    (b.name + " " + b.id + " " + b.types.join(" ")).toLowerCase().includes(q));
  list.sort((a, b) => (b.grade === "6" ? 1 : 0) - (a.grade === "6" ? 1 : 0) ||
                      (a.id < b.id ? -1 : 1));
  const sixN = list.filter(b => b.grade === "6").length;
  const bc = $("#bcount"); if (bc) bc.textContent =
    list.length + " bosses (" + sixN + "x 6-star, " + (list.length - sixN) + "x 5-star)";
  el.innerHTML = `
    <div class="glass hero">
      <div class="role">V3 bosses · which pokemon to use</div>
      <div class="note">Slide in the ▶ tag. ② = backup. Tap a boss for full detail.</div>
    </div>
    <div class="grid">
    ${list.map(b => {
      const rows = bestVsTagRows(b).filter(r => SQUAD11.indexOf(r.x.id) >= 0);
      rows.sort((a, c) => (c.s - a.s) || (c.dmg - a.dmg));
      const r = rows[0]; if (!r) return "";
      const sv = r.surv, alt = rows[1];
      const mult = (r.dmg / Math.max(1, r.x.pe || 100)).toFixed(1);
      return `<article class="card pool" data-boss="${esc(b.id)}" style="cursor:pointer">
        <div class="halo"></div>
        <div class="stars">${stars(b.grade)}</div>
        ${b.img ? `<img src="${b.img}" alt="${esc(b.name)}" loading="lazy">` : ""}
        <span class="ownbadge no">${b.grade === "6" ? "6-star" : "5-star"}</span>
        <div class="cname">${esc(b.name)}</div>
        <div class="cid">${esc(b.id)}</div>
        <div class="pills">${b.types.map(pill).join("")}</div>
        <div class="cid" style="margin-top:8px;font-size:15px;color:var(--text)">▶ ${esc(r.x.name)} · ${esc(r.mvName || "")} · ${Math.round(r.dmg)} (${mult}x)</div>
        <div class="cid" style="color:${(sv && sv.ok) ? "var(--lime)" : "var(--hot)"}">${(sv && sv.ok)
          ? "survives · spare " + Math.round(sv.spare)
          : "dies to the big hit"}</div>
        ${alt ? `<div class="cid">② ${esc(alt.x.name)} · ${Math.round(alt.dmg)}</div>` : ""}
      </article>`;
    }).join("")}
    ${list.length ? "" : `<div class="empty">No boss matches that.</div>`}
  </div>`;
  el.querySelectorAll("[data-boss]").forEach(c => c.onclick = () => {
    const tag = POOL.find(z2 => z2.id === c.dataset.boss);
    if (tag) openCounterPopup(tag);
  });
}

/* ================= BATTLE MODE ================= */
/* Candidates: EVERY owned 5/6-star tag (roster + pool merge), not just squad 11. */
const BATTLE = { foes: [null, null, null], mode: (function(){ try { return localStorage.getItem("meza.battleMode") === "max" ? "max" : "fresh"; } catch(e){ return "fresh"; } })() };
function setBattleMode(v){
  BATTLE.mode = (v === "max") ? "max" : "fresh";
  try { localStorage.setItem("meza.battleMode", BATTLE.mode); } catch(e){}
  renderBattle();
}
/* built LAZILY: ROSTER/POOL fill in the boot IIFE after this line runs */
let CANDS = [];
function buildCands(){
  CANDS.length = 0;
  const hid = (()=>{ try { return JSON.parse(localStorage.getItem("rosterHidden") || "[]"); } catch(e){ return []; } })();
  const src = ROSTER.filter(t2 => (t2.grade === "5" || t2.grade === "6") && !hid.includes(t2.id));
  /* user-added roster tags may live only in POOL */
  for (const id of userRoster()){
    if (!src.some(t2 => t2.id === id) && !hid.includes(id)){
      const p = POOL.find(x => x.id === id);
      if (p) src.push(p);
    }
  }
  CANDS.push(...src.map(t2 => {
    const p = POOL.find(x => x.id === t2.id) || {};
    const m = Object.assign({}, p, t2);
    /* roster rows can hold null/"" fields (V3 pe unknown in roster) - pool wins there */
    for (const k of ["pe","hp","atk","dfn","spa","spd","spe"]){
      if (m[k] === null || m[k] === undefined || m[k] === "") m[k] = p[k];
    }
    if (!Array.isArray(m.moves) || !m.moves.length) m.moves = Array.isArray(p.moves) ? p.moves : [];
    return applyStats(m, t2);
  }));
}
/* v60 AUDIT: roster/pool rows lack the rich per-move metadata that stats_allsets.json
   carries (category Physical|Special, accuracy, attack-roulette value, effect text, and
   the gimmick move). Merge it onto each candidate so Battle can show its work. Never
   overwrite pool move NAMES/types - stats is only consulted where pool lacks it. */
function applyStats(m){
  const s = (window.STATS_BY_ID || {})[m.id];
  if (!s) return m;
  if (!m.gimmick && s.gimmick) m.gimmick = s.gimmick;
  if (!m.move_effect && s.move1 && s.move1.effect) m.move_effect = s.move1.effect;
  [s.move1, s.move2].forEach((mv, i2) => {
    if (!mv || !mv.name) return;
    let t2 = (m.moves || []).find(x2 => x2 && x2.name === mv.name);
    if (!t2){ const nth = (m.moves || [])[i2]; if (nth && !nth.name) t2 = nth; }
    if (!t2 || typeof t2 !== "object") return;
    ["category","accuracy","roulette","effect"].forEach(k => {
      if (!t2[k] && mv[k] !== undefined && mv[k] !== "") t2[k] = mv[k];
    });
    if (!t2.type && mv.type) t2.type = mv.type;
  });
  /* v62 BUGFIX: stats_allsets never fills move2.category (83/83 gimmick moves are
     blank). Without this, offStat() fell back to max(Atk,SpA) and inflated those
     moves by a median of 19% - up to 61% on Chandelure/Alakazam. A gimmick move
     is the same Pokemon's attacking move, so it inherits move1's category. */
  const m1 = (s.move1 && s.move1.name) ? (m.moves || []).find(x2 => x2 && x2.name === s.move1.name) : null;
  if (m1 && m1.category){
    for (const mv of m.moves || []){
      if (mv && mv.name && mv.name !== m1.name && !mv.category) mv.category = m1.category;
    }
  }
  return m;
}
/* scoreOf: one tag vs one enemy - same rules as the popup counter
   (mult tiers, stat shape, survival vs enemy's real sheet moves, gimmick,
   incoming-damage penalty). Returns { s, dmg, mv, sv, inc }. */
/* v54 TRUE 3v3: a Pokemon's attack damages ALL 3 foes (Bulbapedia mechanic), and every
   one of MY tags is hit by ALL 3 enemy attacks each round. battleScore therefore takes
   the whole enemy trio: dmgMap = my best-move damage to EACH foe; sv = survival vs the
   SUM of the trio's incoming (still "just survive the round", Khanh rule). */
/* ============================================================================
   DAMAGE MODEL (v62)
   Mezastar damage scales with the attacking tag's OFFENSIVE STAT - Atk for a
   Physical move, Sp. Atk for a Special one - not with PE. PE (and the sheet's
   "Total / PE") is an energy/power scalar: it is almost exactly 5.0x for every
   tag, so it cannot distinguish a good attacker from a bad one.
   Sources: Bulbapedia battle flow; the Kaizen Hayashi sheet's Avg DMG% column
   correlates with Sp. Atk at +0.84 on Special moves vs only +0.73 for PE.
   PE mode is kept behind a toggle because only 103 of 469 sheet rows have the
   DMG% columns filled, so the constant is fitted rather than known.
   ============================================================================ */
/* measured from the sheet's Avg DMG% vs Avg Gimmick DMG% columns (n=49) */
const GIM_MULT = { "Dynamax": 2.0, "Z-Move": 1.99, "Mega Evolution": 1.56,
  "Gigantamax": 1.7, "Tag Move": 1.9, "Double Move": 1.9, "Chain Attack": 1.9 };
const GIM_DEFAULT = 1.92;
/* dmgModel: "off" = Atk/SpA (real game), "pe" = legacy PE scalar */
let dmgModel = (()=>{ try { return localStorage.getItem("meza.dmgModel") || "off"; } catch(e){ return "off"; } })();
function setDmgModel(v){
  dmgModel = (v === "pe") ? "pe" : "off";
  try { localStorage.setItem("meza.dmgModel", dmgModel); } catch(e){}
  BSC.clear(); CANDS.length = 0; buildCands(); renderBattle();
}
/* the offensive stat a move actually reads */
function offStat(tag, mv){
  if (dmgModel === "pe") return tag.pe || 100;
  const cat = mv && mv.category;
  const phys = cat === "Physical", spec = cat === "Special";
  const a = tag.atk || 0, sp = tag.spa || 0;
  if (phys && a) return a;
  if (spec && sp) return sp;
  if (phys && !a && sp) return sp;
  if (spec && !sp && a) return a;
  /* no category at all: use the tag's better stat ONLY if one is clearly dominant,
     otherwise PE - guessing max() inflated category-less gimmick moves by ~19%. */
  if (a && sp && (a >= sp * 1.5)) return a;
  if (sp && a && (sp >= a * 1.5)) return sp;
  if (a || sp) return tag.pe || 100;
  return tag.pe || 100;
}
function gimMult(tag, mv){
  if (!mv || !mv.gimmick) return 1;
  /* v71: Gigantamax is officially "a special form of Dynamax" and shares its
     per-session allowance, so it must not carry its own independent budget. */
  return GIM_MULT[tag.gimmick] || GIM_DEFAULT;
}
/* v71: the per-TAG Attack Roulette wheel. Bulbapedia: "This roulette has values
   ranging from 5 to 50 depending on the Grade of Pokemon" - and it is NOT uniform
   within a grade (4* Sylveon max 50 vs 5* Sylveon max 35). Fitted against the
   sheet author's own published Max DMG%, damage = 0.708 * offStat * wheelMax is the
   best-fitting form (cv 0.122 over 103 rows; the additive form was worse at 0.175).
   Normalised to the pool median wheel so a missing wheel costs nothing. */
const WHEEL_REF = 35;
function wheelMult(tag){
  const w = tag && tag.id && AR_WHEEL[tag.id];
  return (w && w.max) ? (w.max / WHEEL_REF) : 1;
}
/* ONE strike formula, shared by the engine and the audit panel */
function strikeDmg(tag, mv, defTypes){
  const off = offStat(tag, mv);
  const mm = (mv && mv.type) ? moveMult(mv.type, defTypes) : 1;
  const arI = (mv && MOVE_AR[mv.name]) || null;
  const ar = (arI && arI.ar) ? arI.ar / 100 : 1;
  const gm = gimMult(tag, mv);
  const wm = wheelMult(tag);
  return { off, mm, arRaw: arI ? arI.ar : null, ar, gm, wm,
    d: off * mm * ar * gm * wm };
}

/* v60: full audit trail for a strike, so the Battle card can show every input
   instead of one opaque number: PE x move-type multiplier x attack-roulette x gimmick. */
function strikeTrace(x, foe, mv){
  const r = strikeDmg(x, mv, foe.types);
  return { pe: x.pe || 100, off: r.off, mm: r.mm, arRaw: r.arRaw, ar: r.ar,
    gm: r.gm, gim: r.gm > 1, wm: r.wm, wheel: (x.id && AR_WHEEL[x.id]) ? AR_WHEEL[x.id].max : null,
    d: r.d, mv: mv || null, foe: foe.name || foe.id,
    foeTypes: (foe.types || []).slice() };
}
/* v60: the mirror image - what an ENEMY move does to one of mine, same vocabulary. */
function incomingTrace(f, x, mv){
  const off = offStat(f, mv);
  const mm = (mv && mv.type) ? moveMult(mv.type, x.types) : 1;
  const arI = (mv && MOVE_AR[mv.name]) || null;
  const ar = (arI && arI.ar) ? arI.ar / 100 : 1;
  const gm = gimMult(f, mv);
  const wm = wheelMult(f);
  return { pe: f.pe || 100, off, mm, arRaw: arI ? arI.ar : null, ar, gm, wm, d: off * mm * ar * gm * wm,
    name: (mv && mv.name) || "", from: f.name || f.id, immune: mm === 0, dbl: mm >= 2 };
}

function battleScore(x, enemy, allFoes){
  const foes = (allFoes && allFoes.length === 3 ? allFoes : [enemy]).filter(Boolean);
  /* v61 BUGFIX: the old code seeded `dmg` with PE, so ANY move scoring at or below
     1.00x PE (0.9x attack-roulette, a resisted type, a 0x immunity) was silently
     discarded and replaced by PE itself. Koraidon vs Lunala read 162 instead of a
     real 40. Start from 0 and pick the true best move; PE is only the floor when a
     tag has no usable move at all. */
  let dmg = 0, mvName = "(immune — no move lands)", gim = false;
  const dmgMap = {};
  for (const mv of (x.moves || [])){
    if (!mv || !mv.type) continue;
    const d = strikeDmg(x, mv, enemy.types).d;          /* v62: one shared formula */
    if (d > 0 && mv.gimmick) gim = true;               /* a 0x move never counts as a gimmick proc */
    if (d > dmg){ dmg = d; mvName = mv.name; }          /* true best move, no PE ceiling */
    else if (mvName === "(immune — no move lands)" && d > 0){ mvName = mv.name; }  /* still NAME the real move */
  }
  /* v61: when nothing lands the label is the truth - keep dmg at 0 so the lane number
     can never contradict dmgMap (Torterra vs Lugia read "immune" but 112 dmg). */
  const immuneAll = dmg <= 0 && mvName === "(immune — no move lands)";
  /* v61 BUGFIX: the old code picked the move that was best against the LANE foe and
     then splashed THAT move at everyone. Since ranking is on total AoE damage, the
     right move is the one with the highest SUM across all 3 foes - Tyranitar was
     throwing away 144 damage by leading with Stone Edge instead of Max Rockfall. */
  const mvList = (x.moves || []).filter(mv => mv && mv.type);
  const strikeOf = (mv, f) => strikeDmg(x, mv, f.types).d;
  let mvPick = mvList.find(m2 => m2.name === mvName) || mvList[0] || null;
  if (mvList.length > 1){
    let bestSum = -1;
    for (const cand of mvList){
      let sum = 0;
      for (const f of foes){ if (f) sum += strikeOf(cand, f); }
      if (sum > bestSum){ bestSum = sum; mvPick = cand; }
    }
  }
  for (const f of foes){
    if (!f) continue;
    dmgMap[f.id] = mvPick ? strikeOf(mvPick, f) : (x.pe || 100);
  }
  let sc = 0;
  const mult = dmg / Math.max(1, x.pe || 100);
  if (mult >= 4) sc += 6; else if (mult >= 2) sc += 4;
  const bulk = (x.hp || 100) + (x.dfn || 100) * 0.6 + (x.spd || 100) * 0.6;
  const off = Math.max(x.atk || 0, x.spa || 0) * 0.15 + (x.spe || 50) * 0.05;
  sc += Math.min((bulk + off) / 300 * 10, 4);
  let sv = null;
  /* incoming: ALL 3 enemies strike my side each round - survive their combined worst */
  const ehp = (x.hp || 100) + Math.min(x.dfn || 100, x.spd || 100);
  let worst = 0, hitCount = 0, big = 0, bigMv = "";
  const incRows = [];   /* v60: keep every incoming line so the card can list them */
  for (const f of foes){
    const bs = (window.STATS_BY_ID || {})[f.id] || null;
    if (!bs) continue;
    for (const bm of [bs.move1, bs.move2]){
      if (!bm || !bm.type) continue;
      const d = strikeDmg({ ...bs, gimmick: bs.gimmick }, bm, x.types).d;   /* v62 */
      incRows.push(incomingTrace(f, x, bm));
      if (d > 0){ worst += d; hitCount++; }
      if (d > big){ big = d; bigMv = bm.name + " (" + (f.name || f.id) + ")"; }
    }
  }
  incRows.sort((a, b) => b.d - a.d);
  /* you face one foe per lane; the other attacks are splash. Real damage mitigates via
     Atk-vs-Def (not full PE), so: main hit 0.35x, splash 0.2x - tags survive unless
     badly countered (double-weak), matching on-cart feel. */
  const rawSum = worst;   /* un-mitigated sum, needed to show the splash term honestly */
  worst = 0.35 * big + 0.2 * (worst - big);
  if (hitCount) sv = { ehp, worst, worstMv: bigMv, hits: hitCount, ok: ehp > worst, spare: ehp - worst,
    rows: incRows, main: big, splash: rawSum - big };
  /* v55: s is a damage-flavored tiebreak only - no survival/incoming terms rank */
  if (gim) sc += 0.8;
  const inc = incMoveMult(enemy.types, x.types);
  /* v60: hand the UI the exact move object that won, plus a per-foe trace. All the
     arithmetic above is untouched - this only reports what already happened. */
  const mvx = mvPick || null;
  const trace = { rows: [] };
  for (const f of foes){ if (f) trace.rows.push(strikeTrace(x, f, mvx)); }
  return { s: sc, dmg, dmgMap, mv: mvName, mvObj: mvx, trace, sv, inc };
}
/* cache: candidate x enemy scores built lazily, reused across searches */
const BSC = new Map();
function bsc(x, e, foesKey, allFoes){
  let m = BSC.get(x.id); if (!m){ m = new Map(); BSC.set(x.id, m); }
  const k = e.id + "<<" + foesKey;   /* enemy AND trio context (sv sums the whole trio) */
  let v = m.get(k);
  if (v === undefined){ v = battleScore(x, e, allFoes); m.set(k, v); }
  return v;
}
const BPERMS = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
/* v54: my tag's damage SPLASHES to all 3 foes. Round damage = sum over foes of the best-
   move damage map. alive = my 3 all survive the COMBINED trio incoming. */
function battleAssign(team, foes){
  const foesKey = foes.map(f2 => f2.id).join("|");
  let best = null;
  for (const pm of BPERMS){
    let tot = 0, dmgSum = 0; const pairs = [];
    for (let i2 = 0; i2 < 3; i2++){
      const r = bsc(team[pm[i2]], foes[i2], foesKey, foes);
      tot += r.s; pairs.push({ mine: team[pm[i2]], foe: foes[i2], r });
      /* v55: pure damage-first (Khanh) - no survival gate, no dead-penalty */
      let dRow = 0;
      for (const f of foes){ if (f) dRow += (r.dmgMap && r.dmgMap[f.id]) || 0; }
      dmgSum += dRow;
    }
    /* rank key: max total AoE damage, then s as tiebreak */
    const key = [dmgSum, tot];
    const better = !best || dmgSum > best.key[0]
      || (dmgSum === best.key[0] && tot > best.key[1]);
    if (!best || better) best = { key, tot, dmgSum, pairs };
  }
  return best;
}
/* strongest team: exhaustive C(20,3) = 1140 x 6 pairings, cached scores.
   ~30ms cold, ~10ms warm - fine for a tap. */
function battleBest(foes){
  if (!CANDS.length) buildCands();
  if (CANDS.length < 3 || foes.filter(Boolean).length < 3) return null;
  if (BATTLE.mode === "fresh") return freshBest(foes);
  let best = null;
  const N = CANDS.length;
  for (let a = 0; a < N; a++) for (let b = a + 1; b < N; b++) for (let c = b + 1; c < N; c++){
    const t2 = battleAssign([CANDS[a], CANDS[b], CANDS[c]], foes);
    const better = !best || t2.key[0] > best.key[0]
      || (t2.key[0] === best.key[0] && t2.key[1] > best.key[1]);
    if (!best || better) best = { key: t2.key, tot: t2.tot, dmgSum: t2.dmgSum, team: [CANDS[a], CANDS[b], CANDS[c]], pairs: t2.pairs };
  }
  return best;
}
/* ---- v73 FRESH MODE (Khanh): the argmax team is always the same ~6 meta tags,
   which wins every fight but plays the same three cards forever. Instead, per
   SLOT: rank candidates by that slot's AoE damage, keep the 3-4 near-equals
   (>= FRESH_BAND of the slot's best), and pick the LEAST-RECENTLY-USED among
   them. Slot-local is sound because dmgSum is per-member additive; only the
   lane pairing interacts, and battleAssign still optimises that pairing.
   Usage is stored per foe-trio context so a first battle with new enemies
   explores freely instead of punishing tags for fights they never saw. */
const FRESH_BAND = 0.72;   /* "near-equal" per slot. 0.90 was measured too tight for this
                              meta (slot #1 runs ~16-25% above #2), which collapsed every
                              pool to a single mon and made rotation impossible. */
const FRESH_POOL = 4;      /* consider at most this many near-equals per slot */
/* ---- v75 BATTLE LOG (Khanh): "nên có một battle log lưu lại 20 trận gần nhất để
   đối chiếu và chọn đúng pkm lâu rồi không dùng". The log IS the recency source:
   each entry {ts, foes:[id], team:[id], mode, dmgSum}, newest first, cap 20.
   freshSeen() scans it, so what the log shows is exactly what the picker uses. */
const LOG_CAP = 20;
function freshLog(){
  try {
    const l = JSON.parse(localStorage.getItem("meza.battleLog") || "[]");
    return Array.isArray(l) ? l : [];
  } catch(e){ return []; }
}
function freshSeen(tag){
  const l = freshLog();
  for (let i = 0; i < l.length; i++){
    if (l[i].team && l[i].team.indexOf(tag.id) >= 0) return i + 1;   /* 1 = played last battle */
  }
  return 0;                                                          /* 0 = never / oldest */
}
function freshMarkUsed(team, foes){
  const l = freshLog();
  const entry = {
    ts: Date.now(),
    foes: foes.filter(Boolean).map(f2 => f2.id),
    team: team.map(t => t.id),
    mode: BATTLE.mode,
    dmgSum: null
  };
  /* a pure re-render (mode toggle, tab switch) must NOT log a duplicate fight.
     Same-foes-same-team within 60s = re-render (refresh timestamp only). Beyond
     that, or any different team, it is a REAL new battle and must push - the
     recency engine freezes if identical rematches do not log. */
  const last = l[0];
  const sameFight = last && last.foes.join("|") === entry.foes.join("|")
    && last.team.join("|") === entry.team.join("|")
    && (entry.ts - (last.ts || 0)) < 1500;
  if (sameFight){
    l[0] = entry;                                    /* refresh timestamp only */
  } else {
    l.unshift(entry);
    if (l.length > LOG_CAP) l.length = LOG_CAP;      /* keep the last 20 battles */
  }
  try { localStorage.setItem("meza.battleLog", JSON.stringify(l)); } catch(e){}
  try {
    const rot = parseInt(localStorage.getItem("meza.freshRot") || "0", 10) || 0;
    localStorage.setItem("meza.freshRot", String(rot + 1));
  } catch(e){}
}
function freshBest(foes){
  if (!CANDS.length) buildCands();
  const real = foes.filter(Boolean);
  const foesKey = real.map(f2 => f2.id).join("|");
  const picks = [];
  const used = new Set();
  /* one SLOT per foe: rank candidates by their AoE contribution with that foe
     as the lane, band against the SLOT's own best (not the global best - that
     bug made every slot grab the same strong mons and killed rotation), then
     LRU-pick inside the near-equal pool. */
  for (const e of real){
    const slotScored = CANDS.map(t => {
      const r = bsc(t, e, foesKey, foes);
      let dRow = 0;
      for (const f2 of real){ if (f2) dRow += (r.dmgMap && r.dmgMap[f2.id]) || 0; }
      return { t, v: dRow };
    }).sort((a2, b2) => b2.v - a2.v);
    const top = slotScored[0] ? slotScored[0].v : 0;
    /* near-equal pool: unused candidates within the band, capped at FRESH_POOL.
       If nothing qualifies (small roster or everything already picked this fight),
       fall back to the best unused candidate so a team is always returned. */
    let pool = slotScored.filter(x => !used.has(x.t.id) && x.v >= top * FRESH_BAND);
    if (!pool.length){
      const fb = slotScored.find(x => !used.has(x.t.id));
      if (fb) pool.push(fb);
    }
    /* v75 (Khanh): "mỗi slot 3-4 pkm, 3 slot là 12 pkm... rất nhiều lựa chọn".
       A shallow pool kills rotation, so widen the band progressively until the
       slot has at least 3 candidates - but never admit anything below 55% of
       the slot's best (that much damage would be felt in every fight). */
    if (pool.length < 3){
      const floor = top * 0.55;
      for (const x of slotScored){
        if (pool.length >= 3) break;
        if (!used.has(x.t.id) && x.v >= floor && !pool.some(y => y.t.id === x.t.id)) pool.push(x);
      }
    }
    pool = pool.slice(0, FRESH_POOL);
    /* v75 (Khanh): the pool is the CHOICE, the LRU is the PICK. If enough
       near-equals exist, skip whoever played the immediately previous battle so
       back-to-back fights never field the same card. Only relaxes when the pool
       is too small to survive the exclusion (small rosters still get a team). */
    const lastTeam = (freshLog()[0] || {}).team || [];
    if (pool.length >= 3 && lastTeam.length){
      const rested = pool.filter(x => lastTeam.indexOf(x.t.id) < 0);
      if (rested.length >= 2) pool = rested;
    }
    /* LRU first; within a seen-tied head group, ROTATE by the battle counter so
       each member takes the lead in turn (any fixed tiebreak re-elects the same
       card forever - that limit cycle froze the old rotation). */
    pool.sort((a2, b2) => freshSeen(a2.t) - freshSeen(b2.t));
    const rot = (function(){ try { return parseInt(localStorage.getItem("meza.freshRot") || "0", 10) || 0; } catch(e){ return 0; } })();
    let headEnd = 1;
    while (headEnd < pool.length && freshSeen(pool[headEnd].t) === freshSeen(pool[0].t)) headEnd++;
    if (headEnd > 1){
      const off = rot % headEnd;
      const head = pool.slice(0, headEnd);
      const rest = pool.slice(headEnd);
      pool = head.slice(off).concat(head.slice(0, off)).concat(rest);
    }
    const chosen = pool[0].t;
    used.add(chosen.id);
    picks.push(chosen);
  }
  const t2 = battleAssign(picks, foes);
  return { key: t2.key, tot: t2.tot, dmgSum: t2.dmgSum, team: picks, pairs: t2.pairs, fresh: true };
}
/* enemy slot chip + picker sheet (reuses the scrim modal) */
function renderBattleFoes(){
  const el = $("#battleFoes"); if (!el) return;
  const picked = BATTLE.foes.filter(Boolean).length;
  const head = $("#battleHead");
  if (head && !head.dataset.wired){
    head.dataset.wired = "1";
    head.innerHTML = `<span class="btitle">⚔ Battle</span><span class="bspacer"></span>
      <button class="btab" data-go="binder">Binder</button>
      <button class="btab on" data-go="battle">Battle</button>
      <button class="bexit" data-go="exit">Exit</button>`;
    head.querySelectorAll("[data-go]").forEach(b => b.onclick = () => {
      const g = b.dataset.go;
      if (g === "exit"){ BATTLE.foes = [null, null, null]; tab("binder"); }
      else tab(g);
    });
  }
  el.innerHTML = `<div class="foehead"><span class="foetitle">ENEMY TEAM</span><span class="foesub">${picked}/3${picked < 3 ? " · tap a slot" : ""}</span>${picked ? `<button class="foesclear" id="foesClear">✕</button>` : ""}</div>
    <div class="foerow battlefoes ${picked === 3 ? "done" : ""}">
    ${BATTLE.foes.map((f, i2) => `
    <div class="foeslot ${f ? "filled" : ""}" data-slot="${i2}">
      <span class="slotno">${i2 + 1}</span>
      ${f ? `<img src="${esc(f.img || "")}" alt="" loading="lazy" onerror="this.style.display='none'">
            <div class="fname">${esc(f.name)}</div>
            <div class="ftype">${(f.types || []).map(pill).join(" ")}</div>`
          : `<div class="fname dim">Slot ${i2 + 1}</div><div class="ftype dim">tap to pick</div>`}
    </div>`).join("")}
    </div>`;
  el.querySelectorAll("[data-slot]").forEach(sl => sl.onclick = () => battlePick(sl.dataset.slot));
  const fc = $("#foesClear"); if (fc) fc.onclick = () => { BATTLE.foes = [null, null, null]; renderBattle(); };
}
function battlePick(slot){
  const el = $("#modal");
  const cands = POOL.slice().sort((a, b) => (b.pe || 0) - (a.pe || 0));
  el.innerHTML = `<div class="modalhead">Enemy slot ${+slot + 1} <button class="xbtn" id="x">✕</button></div>
    <input class="bsearch" id="bs" placeholder="Search enemy by name…" autocomplete="off">
    <div class="plist" id="pl">${cands.map(x => `
      <button class="pitem" data-id="${esc(x.id)}">
        <span>${esc(x.name)}</span>
        <span class="psub">${(x.types || []).join("/")} · PE ${x.pe ?? "?"}</span>
      </button>`).join("")}</div>`;
  $("#scrim").classList.add("on");
  $("#x").onclick = closeModal;
  $("#bs").oninput = e => {
    const q = e.target.value.trim().toLowerCase();
    $("#pl").innerHTML = cands.filter(x => !q || x.name.toLowerCase().includes(q) || String(x.id).includes(q)).map(x => `
      <button class="pitem" data-id="${esc(x.id)}">
        <span>${esc(x.name)}</span>
        <span class="psub">${(x.types || []).join("/")} · PE ${x.pe ?? "?"}</span>
      </button>`).join("");
    wirePl();
  };
  const wirePl = () => el.querySelectorAll("[data-id]").forEach(b => b.onclick = () => {
    BATTLE.foes[+slot] = POOL.find(x => x.id === b.dataset.id) || BATTLE.foes[+slot];
    closeModal(); renderBattle();
  });
  wirePl();
  setTimeout(() => { const b = $("#bs"); if (b) b.focus(); }, 50);
}
/* v60 AUDIT UI: everything the score is made of, one tap away. The card keeps its
   compact summary; <details> holds the full arithmetic so nothing is dumped at once. */
const mvTag = (m) => m && m.type ? pill(m.type) : `<span class="dim">—</span>`;
function moveMetaLine(mv){
  if (!mv) return "";
  const bits = [];
  if (mv.category) bits.push(mv.category);
  if (mv.accuracy) bits.push(`acc ${mv.accuracy}`);
  if (mv.roulette) bits.push(`roulette ${mv.roulette}`);
  if (mv.effect) bits.push(mv.effect);
  return bits.map(b => `<span class="kv">${esc(b)}</span>`).join("");
}
function auditCard(pr, foes){
  const r = pr.r, mine = pr.mine, mv = r.mvObj, tr = r.trace || { rows: [] };
  const rowSum = tr.rows.reduce((a, t) => a + t.d, 0);
  const g = mine.gimmick;
  /* damage formula, factored */
  const t0 = tr.rows[0] || { pe: mine.pe || 100, off: mine.pe || 100, mm: 1, ar: 1, arRaw: null, gim: false, gm: 1, wm: 1, wheel: null };
  const useOff = dmgModel === "off";
  const statLbl = (mv && mv.category === "Physical") ? "Atk" : (mv && mv.category === "Special") ? "SpA" : (useOff ? "Atk/SpA" : "PE");
  const factors = [
    `<span class="fn">${statLbl}</span><span class="fv">${t0.off}</span>`,
    useOff ? `<span class="fn">PE</span><span class="fv dim">${t0.pe}</span>` : "",
    t0.mm !== 1 ? `<span class="fn">type</span><span class="fv ${t0.mm > 1 ? "up" : "down"}">×${t0.mm}</span>` : "",
    t0.arRaw ? `<span class="fn">roulette</span><span class="fv">×${(Math.round(t0.ar * 100) / 100)}</span>` : "",
    t0.wheel ? `<span class="fn">wheel max</span><span class="fv">${t0.wheel}</span>` : "",
    t0.gim ? `<span class="fn">gimmick</span><span class="fv up">×${t0.gm}</span>` : "",
    `<span class="fn">=</span><span class="fv total">${Math.round(t0.d)}</span>`
  ].filter(Boolean).join("");
  const foeRows = tr.rows.map(t => `
    <tr>
      <td class="who">${esc(t.foe)}</td>
      <td class="tt">${(t.foeTypes || []).map(pill).join(" ")}</td>
      <td class="num ${t.mm > 1 ? "up" : t.mm === 0 ? "zero" : t.mm < 1 ? "down" : ""}">${t.mm}×</td>
      <td class="num strong">${Math.round(t.d)}</td>
    </tr>`).join("");
  let inc = "";
  if (r.sv && r.sv.rows && r.sv.rows.length){
    const ir = r.sv.rows.map(t => `
      <tr>
        <td class="who">${esc(t.from)}</td>
        <td class="mv">${esc(t.name)}${t.immune ? ` <span class="zero">immune</span>` : t.dbl ? ` <span class="up">2×</span>` : ""}</td>
        <td class="num">${t.mm}×</td>
        <td class="num strong">${Math.round(t.d)}</td>
      </tr>`).join("");
    inc = `
      <div class="ablock">
        <div class="ahead">📥 INCOMING — all ${r.sv.hits} enemy hits this round</div>
        <table class="atable"><thead><tr><th>from</th><th>move</th><th>×</th><th>dmg</th></tr></thead><tbody>${ir}</tbody></table>
        <div class="afoot">main hit ${Math.round(r.sv.main)} ×0.35 + splash ${Math.round(r.sv.splash)} ×0.2 = <b>${Math.round(r.sv.worst)}</b> vs eHP <b>${r.sv.ehp}</b> (HP + min(Def,SpD))</div>
      </div>`;
  }
  const stats = mine && (mine.hp || mine.atk) ? `
      <div class="ablock">
        <div class="ahead">📊 TAG STATS</div>
        <div class="astats">
          ${[["HP",mine.hp],["ATK",mine.atk],["DEF",mine.dfn],["SPA",mine.spa],["SPD",mine.spd],["SPE",mine.spe]]
            .filter(([, v]) => v !== null && v !== undefined && v !== "")
            .map(([k, v]) => `<span class="ast"><i>${k}</i>${v}</span>`).join("")}
        </div>
        ${mine.move_effect ? `<div class="afoot">move effect: ${esc(mine.move_effect)}</div>` : ""}
      </div>` : "";
  return `<details class="audit">
      <summary class="asum">⚙ how this number is built</summary>
      <div class="abody">
        <div class="ablock">
          <div class="ahead">⚔️ MY MOVE</div>
          <div class="amvrow">${mvTag(mv)} <span class="amv">${esc(r.mv)}</span></div>
          <div class="amvmeta">${moveMetaLine(mv) || `<span class="dim">no extra effect</span>`}</div>
          ${g ? `<div class="agim">✨ gimmick: ${esc(g)}</div>` : ""}
          <div class="aformula">${factors}</div>
        </div>
        <div class="ablock">
          <div class="ahead">💥 SPLASH — same move hits all 3 foes</div>
          <table class="atable"><thead><tr><th>foe</th><th>types</th><th>×</th><th>dmg</th></tr></thead><tbody>${foeRows}</tbody></table>
          <div class="afoot">total to all 3 = <b>${Math.round(rowSum)}</b> dmg</div>
        </div>
        ${inc}${stats}
        <div class="afoot dim">damage-first ranking · survival is shown, never scored</div>
      </div>
    </details>`;
}

function renderBattle(){
  const el = $("#battleBox"); if (!el) return;
  renderBattleFoes();
  const foes = BATTLE.foes.filter(Boolean);
  if (foes.length < 3){
    el.innerHTML = `<div class="empty">⚔️ Pick 3 enemy tags above.${foes.length ? ` (${foes.length}/3 picked)` : ""}</div>`;
    return;
  }
  const t0 = performance.now();
  const win = battleBest(BATTLE.foes);
  if (!win){ el.innerHTML = `<div class="empty">Building your binder… tap again.</div>`; return; }
  if (win.fresh) freshMarkUsed(win.team, BATTLE.foes);   /* v73: record the rotation */
  /* v75: Max Power battles log too - the log is the battle history, not a fresh-mode
     internal. Log AFTER the render constants exist so the entry carries dmgSum. */
  if (!win.fresh){
    freshMarkUsed(win.team, BATTLE.foes);
    try {
      const l0 = freshLog();
      if (l0.length) l0[0].dmgSum = Math.round(win.dmgSum);
      localStorage.setItem("meza.battleLog", JSON.stringify(l0));
    } catch(e){}
  } else {
    try {
      const lf = freshLog();
      if (lf.length) lf[0].dmgSum = Math.round(win.dmgSum);
      localStorage.setItem("meza.battleLog", JSON.stringify(lf));
    } catch(e){}
  }
  const ms = Math.max(1, Math.round(performance.now() - t0));
  const risk = 0; /* v55: survival no longer ranks - damage-first */
  /* v75: log snapshot for display (newest first, capped at 20) */
  const blog = freshLog().slice(0, 20).map((be, i3) => Object.assign({ i: i3 }, be));
  el.innerHTML = `
    <div class="arena">
      <div class="vsline"><span class="mineTag">YOUR 3</span><span class="vsbadge">VS</span><span class="foeTag">ENEMY 3</span></div>
      <div class="teamstrip">
        ${win.pairs.map(pr => `
          <div class="tslot">
            <img src="${esc(pr.mine.img || "")}" alt="" loading="lazy" onerror="this.style.display='none'">
            <div class="tsname">${esc(pr.mine.name)}</div>
            <div class="tspe">PE ${pr.mine.pe ?? "?"} <span class="stars">${stars(pr.mine.grade)}</span></div>
          </div>`).join("")}
      </div>
      <div class="vsfoot clean">💥 max total damage: <b>${Math.round(win.dmgSum)}</b><span class="dim" style="font-size:.72em"> · AoE: every hit damages all 3 · damage-first ranking · ${CANDS.length} tags searched · ${ms}ms</span></div>
      <div class="modelrow">
        <span class="mlabel">damage stat</span>
        <button class="mtog ${dmgModel === "off" ? "on" : ""}" data-model="off">Atk / Sp.ATK</button>
        <button class="mtog ${dmgModel === "pe" ? "on" : ""}" data-model="pe">PE</button>
        <span class="mnote">${dmgModel === "off"
          ? "real game: damage reads the move's offensive stat"
          : "legacy: flat PE scalar"}</span>
      </div>
      <div class="modelrow">
        <span class="mlabel">team style</span>
        <button class="mtog ${BATTLE.mode !== "max" ? "on" : ""}" data-bmode="fresh">🔄 Fresh</button>
        <button class="mtog ${BATTLE.mode === "max" ? "on" : ""}" data-bmode="max">💥 Max Power</button>
        <span class="mnote">${BATTLE.mode === "max"
          ? "always the single strongest team"
          : "rotates your roster: per slot picks among ~3-4 near-equal cards, least-played first"}</span>
      </div>
    </div>
    ${win.pairs.map((pr, i2) => {
      const r = pr.r;
      const mult = (r.dmg / Math.max(1, pr.mine.pe || 100)).toFixed(1);
      const splash = foes.reduce((a2, f2) => a2 + ((r.dmgMap && r.dmgMap[f2.id]) || 0), 0);
      const ratio = Math.min(100, Math.round(r.dmg / Math.max(1, r.dmg, 900) * 100));
      return `<article class="matchup ${r.sv ? (r.sv.ok ? "ok" : "danger") : ""}">
        <div class="mrow">
          <div class="mside me">
            <img src="${esc(pr.mine.img || "")}" alt="" loading="lazy" onerror="this.style.display='none'">
            <div class="msname">${esc(pr.mine.name)}</div>
            <div class="mstypes">${(pr.mine.types || []).map(pill).join(" ")}</div>
          </div>
          <div class="mvs">VS</div>
          <div class="mside them">
            <img src="${esc(pr.foe.img || "")}" alt="" loading="lazy" onerror="this.style.display='none'">
            <div class="msname">${esc(pr.foe.name)}</div>
            <div class="mstypes">${(pr.foe.types || []).map(pill).join(" ")}</div>
          </div>
        </div>
        <div class="mverdict ${r.sv ? (r.sv.ok ? "good" : "bad") : ""}">${r.sv ? (r.sv.ok
          ? `🛡 survives all ${r.sv.hits} enemy hits · spare ${Math.round(r.sv.spare)}`
          : `☠ falls short vs ${r.sv.hits} enemy hits · -${Math.round(-r.sv.spare)}`) : ""}</div>
        <div class="mnum">
          <span class="mvname">${esc(r.mv)}</span>
          <span class="mdmg">${Math.round(r.dmg)}<small>dmg</small></span>
          <span class="mmult">${mult}x</span>
          <span class="minc">${r.inc}x taken</span>
          <span class="msplash">💥 ${Math.round(splash)} to all 3</span>
        </div>
        <div class="mbar"><i style="width:${ratio}%"></i></div>
        ${auditCard(pr, foes)}
      </article>`;
    }).join("")}
    <details class="blog">
      <summary>📜 Battle log — last ${blog.length} ${blog.length === 1 ? "battle" : "battles"}</summary>
      ${blog.length ? blog.map(be => {
        const f3 = be.foes.map(id => { const t2 = POOL.find(x => x.id === id) || ROSTER.find(x => x.id === id); return t2 ? t2.name : id; });
        const m3 = be.team.map(id => { const t2 = POOL.find(x => x.id === id) || ROSTER.find(x => x.id === id); return t2 ? t2.name : id; });
        return `<div class="blogrow${be.i === 0 ? " now" : ""}">
          <span class="blogn">${be.i === 0 ? "▸" : be.i + 1}</span>
          <span class="blogteams"><b>${m3.join(" · ")}</b><br><span class="dim">vs ${f3.join(" · ")}</span></span>
          <span class="blogd">${be.dmgSum ? "💥" + be.dmgSum : ""}${be.mode === "max" ? ' <span class="dim">max</span>' : ""}</span>
        </div>`;
      }).join("") : `<div class="blogrow dim">no battles logged yet</div>`}
    </details>
    <div class="btnrow"><button class="btn" id="battleAgain">⚔️ New battle</button></div>`;
  el.querySelectorAll(".mtog").forEach(b => b.onclick = () => {
    if (b.dataset.bmode) return setBattleMode(b.dataset.bmode);
    setDmgModel(b.dataset.model);
  });
  const ba = $("#battleAgain"); if (ba) ba.onclick = () => { BATTLE.foes = [null, null, null]; renderBattle(); };
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
/* Win streaks over the battle log. LOG is newest-last push order, so walk from
   the end for the current run and scan the whole log for the record. */
function streaks(){
  let cur = 0;
  for (let i = LOG.length - 1; i >= 0; i--){
    if (!LOG[i].win) break;
    cur++;
  }
  let best = 0, run = 0;
  for (const e of LOG){
    run = e.win ? run + 1 : 0;
    if (run > best) best = run;
  }
  return { cur, best };
}

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
      <div class="hint" style="margin-top:6px">One of each per session. Nidoqueen holds Dynamax, Lucario or Torterra holds Mega, Chandelure holds the Z Move.</div>
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
      renderStats(); renderLoadout(); renderSquad(); flashNote("#statsBox", "Imported ✔");
    } catch(e){ flashNote("#statsBox", "That is not a valid backup."); } };
  $("#resetBtn").onclick = () => {
    if (!confirm("Delete wishlist, log, teams and settings? This cannot be undone.")) return;
    ["wish","log","teams","team","set","session"].forEach(k => localStorage.removeItem("meza."+k));
    WISH = []; LOG = []; SAVED_TEAMS = []; TEAM = [null,null,null]; SESSION = null; SETTINGS = { ve:"en", dim:false };
    renderStats(); renderLoadout(); renderSquad();
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
    b.textContent = t(b.dataset.tab === "binder" ? "tb" : b.dataset.tab === "load" ? "tl" : "ts"); });
  const q = $("#q"); if (q) q.placeholder = t("sq");
  document.querySelectorAll(".drawer .dlink[data-tab]").forEach(b => {
    b.lastChild.textContent = " " + t(b.dataset.tab === "binder" ? "tb" : b.dataset.tab === "load" ? "tl" : "ts"); });
}

/* ================= SUPPORT TICKETS ================= */
/* Data: docs/data/support.json
   Source: Bulbapedia "Support Pokemon Tickets" sections across the 19 Pokemon
   Mezastar expansion set pages (Set 1-4, Super Tag 1-5, Double Chain 1-5,
   Gorgeous Star 1-4). Fetched 2026-10-03, 86 offers across 74 Pokemon.
   NOTE ON QR: the scan codes embedded in real Mezastar tickets are unique per
   member / per magazine copy and are never published. The QR shown here is a
   real, scannable code that opens this Dex filtered to the Pokemon - it is NOT
   a copy of a ticket and must not be presented as one. */
const SUPPORT_TODAY = "2026-10-03";

let SUP = { entries: [], loaded: false };

const SRC_LABEL = {
  club:     { cls: "club",     text: "Mezastar Club" },
  pamphlet: { cls: "pamphlet", text: "Promo pamphlet" },
  magazine: { cls: "magazine", text: "CoroCoro magazine" },
};

function supFmtDate(iso){
  if (!iso) return "?";
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [y,m,d] = iso.split("-").map(Number);
  return `${d} ${M[m-1]} ${y}`;
}
function supAge(iso){
  if (!iso) return 0;
  return Math.round((Date.parse(SUPPORT_TODAY) - Date.parse(iso)) / 86400000);
}
/* A ticket is only usable while the machine still honours it. Every Mezastar
   offer we have on record closed by 2024-04-30, so nothing here is live. */
function supStatus(t){
  const d = supAge(t.untilDate);
  if (d <= 0) return { key: "live",   text: "Live now" };
  if (d <= 90) return { key: "recent", text: "Recently ended" };
  return { key: "old", text: "Ended" };
}
function supTypes(t){
  return (t.types || []).filter(Boolean);
}
/* De-duplicate by Pokemon so the grid reads as one card per support Pokemon,
   with every set it was ever offered in listed underneath. */
function supUnique(){
  const map = new Map();
  for (const t of SUP.entries){
    if (!map.has(t.slug)){
      map.set(t.slug, Object.assign({}, t, { offers: [t] }));
    } else {
      map.get(t.slug).offers.push(t);
    }
  }
  const list = [...map.values()];
  for (const u of list){
    u.offers.sort((a,b) => (a.fromDate < b.fromDate ? -1 : 1));
    const ends = u.offers.map(o => o.untilDate).filter(Boolean).sort();
    u.lastValid = ends[ends.length - 1] || "";
    u.sets = [...new Set(u.offers.map(o => o.set))];
    u.sources = [...new Set(u.offers.map(o => o.source))];
    u.timesOffered = u.offers.length;
  }
  return list;
}
let SUP_UNIQ = [];

async function loadSupport(){
  if (SUP.loaded) return;
  try {
    const r = await fetch("data/support.json", { cache: "no-cache" });
    SUP.entries = (await r.json()).entries || [];
    SUP.loaded = true;
  } catch (e) {
    SUP.entries = [];
  }
  SUP_UNIQ = supUnique();
}

function renderTickets(){
  const q = ($("#tq")?.value || "").trim().toLowerCase();
  const f = window.ticketFilter || "all";

  let list = SUP_UNIQ.slice();
  if (f === "club")     list = list.filter(u => u.sources.includes("club"));
  if (f === "pamphlet") list = list.filter(u => u.sources.includes("pamphlet"));
  if (f === "magazine") list = list.filter(u => u.sources.includes("magazine"));
  if (f === "multi")    list = list.filter(u => u.timesOffered > 1);
  if (q){
    list = list.filter(u =>
      (u.name + " " + u.move + " " + u.sets.join(" ") + " " +
       supTypes(u).join(" ") + " " + u.sources.join(" ")).toLowerCase().includes(q));
  }
  list.sort((a,b) => (a.lastValid < b.lastValid ? 1 : a.lastValid > b.lastValid ? -1 : 0));

  const offers = list.reduce((n,u) => n + u.timesOffered, 0);
  $("#ticketCount").innerHTML = SUP.loaded
    ? `<b>${list.length}</b> support Pokémon · <b>${offers}</b> historical offers · latest closed <b>${supFmtDate(list.length ? list[0].lastValid : "")}</b>`
    : `<span class="spin"></span> loading support data…`;

  if (!SUP.loaded){ return; }
  if (!list.length){ $("#tgrid").innerHTML = `<div class="empty">No support Pokémon match that filter.</div>`; return; }

  $("#tgrid").innerHTML = list.map((u, i) => {
    const types = supTypes(u);
    const glow = TYPE_COLOR[types[0]] || "#c9a227";
    const st = supStatus({ untilDate: u.lastValid });
    const srcBadges = u.sources.map(s => {
      const S = SRC_LABEL[s] || { cls: "club", text: s };
      return `<span class="supsrc ${S.cls}">${S.text}</span>`;
    }).join("");
    const setLine = u.sets.length === 1
      ? esc(u.sets[0])
      : `${esc(u.sets[0])} <span class="supmore">+${u.sets.length - 1}</span>`;

    return `
    <article class="supcard" data-slug="${u.slug}" style="--glow:${glow}">
      <div class="supart">
        <img src="${u.img}" alt="${esc(u.name)}" loading="${i < 9 ? 'eager' : 'lazy'}" decoding="async"${u.animated ? ' class="gifspr"' : ''}>
      </div>
      <div class="supqr">
        <img src="${u.qr}" alt="QR linking to ${esc(u.name)} support page" loading="lazy" decoding="async">
        <span class="supqr-cap">Dex</span>
      </div>
      <div class="supbody">
        <div class="supname">${esc(u.name)}</div>
        <div class="supset">${setLine}</div>
        <div class="pills">${types.map(pill).join("")}</div>
        <div class="supmove"><b>${esc(u.move)}</b><i>${esc(u.moveType || "")}</i></div>
        <div class="supmeta">
          ${srcBadges}
          <span class="supstat ${st.key}">${st.text}</span>
        </div>
        <div class="supdates">valid to ${supFmtDate(u.lastValid)}</div>
      </div>
    </article>`;
  }).join("");
}

/* QR scans land back here as ?support=<slug> and jump straight to the card. */
function supFocus(slug){
  const el = document.querySelector(`.supcard[data-slug="${slug}"]`);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("supflash");
  setTimeout(() => el.classList.remove("supflash"), 2600);
  return true;
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
  window.scrollTo(0, 0);
  document.querySelectorAll("nav.tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === name));
  document.querySelectorAll(".drawer .dlink[data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === name));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("on", p.id === "p-" + name));
  if (name === "stats") renderStats();
  if (name === "battle") renderBattle();
  if (name === "load") renderLoadout();
  if (name === "tickets") renderTickets();
}
document.querySelectorAll("nav.tabs button").forEach(b => b.onclick = () => tab(b.dataset.tab));
document.querySelectorAll(".drawer .dlink[data-tab]").forEach(b => b.onclick = () => { tab(b.dataset.tab); setDrawer(false); });
$("#q").oninput = e => { state.q = e.target.value; renderGrid(); };
$("#sortBtn").onclick = () => { state.sort = "pe"; $("#sortBtn").classList.add("act"); $("#sortName").classList.remove("act"); $("#sortDense").classList.remove("act"); renderGrid(); };
$("#sortName").onclick = () => { state.sort = "name"; $("#sortName").classList.add("act"); $("#sortBtn").classList.remove("act"); $("#sortDense").classList.remove("act"); renderGrid(); };
$("#sortDense").onclick = () => { state.sort = "dense"; $("#sortDense").classList.add("act"); $("#sortBtn").classList.remove("act"); $("#sortName").classList.remove("act"); renderGrid(); };






/* hunt list removed v53 - #bq gone */
$("#tq").oninput = e => { renderTickets(); };
document.querySelectorAll("#ticketFilters .btn").forEach(b => b.onclick = () => {
  window.ticketFilter = b.dataset.f;
  document.querySelectorAll("#ticketFilters .btn").forEach(x => x.classList.toggle("act", x === b));
  renderTickets(); });
$("#cmpGo").onclick = () => openCompareModal();
$("#cmpClear").onclick = () => { SEL.clear(); renderGrid(); };

(async function init(){
  try{
    const [ro, po, bo, tc, sst, mar, arw, spr, px] = await Promise.all([
          fetch("data/roster.json").then(r => r.json()),
          fetch("data/pool.json").then(r => r.json()),
          fetch("data/bosses.json").then(r => r.json()),
          fetch("data/typechart.json").then(r => r.json()),
          fetch("data/stats_allsets.json").then(r => r.json()).catch(() => []),
          fetch("data/move_ar.json").then(r => r.json()).then(j => j.moves || {}).catch(() => ({})),
          fetch("data/ar_wheel.json").then(r => r.json()).then(j => j.tags || {}).catch(() => ({})),
          fetch("island/data/sprites.json").then(r => r.json()).catch(() => ({})),
          fetch("island/data/pokedex.json").then(r => r.json()).catch(() => ({}))
        ]);
        ROSTER = ro.tags; POOL = po.tags; BOSSES = bo.bosses; CHART = tc.chart; TYPES = tc.types; MOVE_AR = mar || {}; AR_WHEEL = arw || {};
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
    const quick = ["Lugia","Ho-Oh","Solgaleo","Lunala","Eternatus","Zygarde","Greninja","Keldeo","Zeraora","Grimmsnarl","Tyranitar","Chandelure"];
            document.body.classList.toggle("dim", !!SETTINGS.dim);
        renderChips(); renderGrid(); renderLoadout();
        renderSquad(); renderStats();
        /* support tab: lazy data + QR deep link (?support=slug) */
        const slug = new URLSearchParams(location.search).get("support");
        if (slug){ tab("tickets"); }
        await loadSupport();
        if (slug){ renderTickets(); supFocus(slug); }
        // translate ticket filter buttons
        document.querySelectorAll("#ticketFilters .btn[data-f]").forEach(b => {
          const key = b.dataset.f; if (!b.textContent.trim()) b.textContent = t(key);
        });
      }catch(err){
        document.querySelectorAll(".spin").forEach(s => s.outerHTML = `<div class="empty">Could not load the binder data: ${err.message}</div>`);
      }
    })();

/* Installable on the phone home screen, and works offline once opened (art is cached). */
if ("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
