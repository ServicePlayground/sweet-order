import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "@web-user/backend/app.module";
import { BaseTest } from "./base-test";

/**
 * 테스트 데코레이터
 * 테스트 코드의 중복을 줄이고 가독성을 높이기 위한 데코레이터들
 */

/**
 * 인증 테스트 데코레이터
 * 인증 관련 테스트에서 공통으로 사용되는 설정을 자동으로 적용
 */
export function AuthTest(target: any) {
  const originalDescribe = target.describe;

  target.describe = function (description: string, fn: () => void) {
    originalDescribe.call(this, `[인증 테스트] ${description}`, fn);
  };

  return target;
}

/**
 * 통합 테스트 데코레이터
 * 통합 테스트에서 공통으로 사용되는 설정을 자동으로 적용
 */
export function IntegrationTest(target: any) {
  const originalDescribe = target.describe;

  target.describe = function (description: string, fn: () => void) {
    originalDescribe.call(this, `[통합 테스트] ${description}`, fn);
  };

  return target;
}

/**
 * 성능 테스트 데코레이터
 * 성능 테스트에서 공통으로 사용되는 설정을 자동으로 적용
 */
export function PerformanceTest(target: any) {
  const originalDescribe = target.describe;

  target.describe = function (description: string, fn: () => void) {
    originalDescribe.call(this, `[성능 테스트] ${description}`, fn);
  };

  return target;
}

/**
 * 보안 테스트 데코레이터
 * 보안 테스트에서 공통으로 사용되는 설정을 자동으로 적용
 */
export function SecurityTest(target: any) {
  const originalDescribe = target.describe;

  target.describe = function (description: string, fn: () => void) {
    originalDescribe.call(this, `[보안 테스트] ${description}`, fn);
  };

  return target;
}

/**
 * 테스트 설정 데코레이터
 * 테스트 클래스에 공통 설정을 자동으로 적용
 */
export function TestSetup(options: { timeout?: number; retries?: number; parallel?: boolean }) {
  return function (target: any) {
    const originalDescribe = target.describe;

    target.describe = function (description: string, fn: () => void) {
      const testFn = function () {
        if (options.timeout) {
          jest.setTimeout(options.timeout);
        }

        if (options.retries) {
          jest.retryTimes(options.retries);
        }

        if (options.parallel) {
          jest.setTimeout(0); // 무제한 타임아웃으로 병렬 실행
        }

        fn();
      };

      originalDescribe.call(this, description, testFn);
    };

    return target;
  };
}

/**
 * 데이터베이스 테스트 데코레이터
 * 데이터베이스 관련 테스트에서 공통으로 사용되는 설정을 자동으로 적용
 */
export function DatabaseTest(target: any) {
  const originalDescribe = target.describe;

  target.describe = function (description: string, fn: () => void) {
    const testFn = function () {
      // 데이터베이스 테스트 전후 정리
      beforeAll(async () => {
        // 테스트 시작 전 데이터베이스 정리
      });

      afterAll(async () => {
        // 테스트 종료 후 데이터베이스 정리
      });

      beforeEach(async () => {
        // 각 테스트 전 데이터베이스 정리
      });

      afterEach(async () => {
        // 각 테스트 후 데이터베이스 정리
      });

      fn();
    };

    originalDescribe.call(this, `[데이터베이스 테스트] ${description}`, testFn);
  };

  return target;
}

/**
 * API 테스트 데코레이터
 * API 테스트에서 공통으로 사용되는 설정을 자동으로 적용
 */
export function ApiTest(target: any) {
  const originalDescribe = target.describe;

  target.describe = function (description: string, fn: () => void) {
    const testFn = function () {
      // API 테스트 공통 설정
      beforeAll(async () => {
        // API 테스트 시작 전 설정
      });

      afterAll(async () => {
        // API 테스트 종료 후 정리
      });

      fn();
    };

    originalDescribe.call(this, `[API 테스트] ${description}`, testFn);
  };

  return target;
}

/**
 * 테스트 그룹 데코레이터
 * 관련된 테스트들을 그룹화
 */
export function TestGroup(groupName: string) {
  return function (target: any) {
    const originalDescribe = target.describe;

    target.describe = function (description: string, fn: () => void) {
      originalDescribe.call(this, `[${groupName}] ${description}`, fn);
    };

    return target;
  };
}

/**
 * 테스트 시나리오 데코레이터
 * 특정 시나리오를 테스트하는 데코레이터
 */
export function TestScenario(scenarioName: string) {
  return function (target: any) {
    const originalDescribe = target.describe;

    target.describe = function (description: string, fn: () => void) {
      originalDescribe.call(this, `[시나리오: ${scenarioName}] ${description}`, fn);
    };

    return target;
  };
}

/**
 * 테스트 우선순위 데코레이터
 * 테스트 실행 순서를 지정
 */
export function TestPriority(priority: number) {
  return function (target: any) {
    target.priority = priority;
    return target;
  };
}

/**
 * 테스트 태그 데코레이터
 * 테스트에 태그를 추가하여 필터링 가능하게 함
 */
export function TestTag(...tags: string[]) {
  return function (target: any) {
    target.tags = tags;
    return target;
  };
}

/**
 * 테스트 메타데이터 데코레이터
 * 테스트에 메타데이터를 추가
 */
export function TestMetadata(metadata: Record<string, any>) {
  return function (target: any) {
    target.metadata = metadata;
    return target;
  };
}

/**
 * 테스트 환경 데코레이터
 * 특정 환경에서만 실행되는 테스트
 */
export function TestEnvironment(environment: string) {
  return function (target: any) {
    const originalDescribe = target.describe;

    target.describe = function (description: string, fn: () => void) {
      const testFn = function () {
        if (process.env.NODE_ENV !== environment) {
          return; // 다른 환경에서는 테스트 실행하지 않음
        }

        fn();
      };

      originalDescribe.call(this, `[환경: ${environment}] ${description}`, testFn);
    };

    return target;
  };
}

/**
 * 테스트 조건 데코레이터
 * 특정 조건에서만 실행되는 테스트
 */
export function TestCondition(condition: () => boolean, conditionName: string) {
  return function (target: any) {
    const originalDescribe = target.describe;

    target.describe = function (description: string, fn: () => void) {
      const testFn = function () {
        if (!condition()) {
          return; // 조건이 맞지 않으면 테스트 실행하지 않음
        }

        fn();
      };

      originalDescribe.call(this, `[조건: ${conditionName}] ${description}`, testFn);
    };

    return target;
  };
}

/**
 * 테스트 스킵 데코레이터
 * 특정 테스트를 스킵
 */
export function TestSkip(reason: string) {
  return function (target: any) {
    const originalDescribe = target.describe;

    target.describe = function (description: string, fn: () => void) {
      const testFn = function () {
        console.log(`테스트 스킵: ${reason}`);
        return; // 테스트 실행하지 않음
      };

      originalDescribe.call(this, `[스킵] ${description}`, testFn);
    };

    return target;
  };
}

/**
 * 테스트 포커스 데코레이터
 * 특정 테스트만 실행
 */
export function TestFocus(target: any) {
  const originalDescribe = target.describe;

  target.describe = function (description: string, fn: () => void) {
    const testFn = function () {
      // 포커스된 테스트만 실행
      if (process.env.TEST_FOCUS === "true") {
        fn();
      } else {
        return;
      }
    };

    originalDescribe.call(this, `[포커스] ${description}`, testFn);
  };

  return target;
}

/**
 * 테스트 반복 데코레이터
 * 테스트를 여러 번 실행
 */
export function TestRepeat(count: number) {
  return function (target: any) {
    const originalDescribe = target.describe;

    target.describe = function (description: string, fn: () => void) {
      for (let i = 0; i < count; i++) {
        const testFn = function () {
          fn();
        };

        originalDescribe.call(this, `${description} (반복 ${i + 1}/${count})`, testFn);
      }
    };

    return target;
  };
}
