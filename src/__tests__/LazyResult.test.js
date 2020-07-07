// @flow strict

import LazyResult, { Failure, Initial, Loading, Success } from '../LazyResult';

describe('LazyResult', () => {
    const r1 = LazyResult.initial();
    const r2 = LazyResult.loading();
    const r3 = LazyResult.failure('oops');
    const r4 = LazyResult.success('awesome');

    it('toString', () => {
        expect(r1.toString()).toBe('Initial');
        expect(r2.toString()).toBe('Loading');
        expect(r3.toString()).toBe('Failure(oops)');
        expect(r4.toString()).toBe('Success(awesome)');
    });

    it('inspection', () => {
        expect(r1.isInitial()).toBe(true);
        expect(r1.isLoading()).toBe(false);
        expect(r1.isFailure()).toBe(false);
        expect(r1.isSuccess()).toBe(false);

        expect(r2.isInitial()).toBe(false);
        expect(r2.isLoading()).toBe(true);
        expect(r2.isFailure()).toBe(false);
        expect(r2.isSuccess()).toBe(false);

        expect(r3.isInitial()).toBe(false);
        expect(r3.isLoading()).toBe(false);
        expect(r3.isFailure()).toBe(true);
        expect(r3.isSuccess()).toBe(false);

        expect(r4.isInitial()).toBe(false);
        expect(r4.isLoading()).toBe(false);
        expect(r4.isFailure()).toBe(false);
        expect(r4.isSuccess()).toBe(true);
    });

    it('convenience constructors', () => {
        expect(Initial().isInitial()).toBe(true);
        expect(Loading().isLoading()).toBe(true);
        expect(Failure().isFailure()).toBe(true);
        expect(Success().isSuccess()).toBe(true);
    });

    it('dispatching', () => {
        const [v1, v2, v3, v4] = [r1, r2, r3, r4].map((m) =>
            // prettier-ignore
            m.dispatch(
                () => '',
                () => 'Loading...',
                e => `Error: ${e}`,
                data => `Data: ${data}`,
            )
        );
        expect(v1).toBe('');
        expect(v2).toBe('Loading...');
        expect(v3).toBe('Error: oops');
        expect(v4).toBe('Data: awesome');
    });

    it('mapSuccess', () => {
        const [v1, v2, v3, v4] = [r1, r2, r3, r4].map((m) => m.mapSuccess((data) => `Data: ${data}`));
        expect(v1).toEqual(r1);
        expect(v2).toEqual(r2);
        expect(v3).toEqual(r3);
        expect(v4).toEqual(Success('Data: awesome'));
    });

    it('mapFailure', () => {
        const [v1, v2, v3, v4] = [r1, r2, r3, r4].map((m) => m.mapFailure(() => 42));
        expect(v1).toEqual(r1);
        expect(v2).toEqual(r2);
        expect(v3).toEqual(Failure(42));
        expect(v4).toEqual(r4);
    });

    it('value', () => {
        const [v1, v2, v3, v4] = [r1, r2, r3, r4].map((m) => m.value());
        expect(v1).toBe(undefined);
        expect(v2).toBe(undefined);
        expect(v3).toBe(undefined);
        expect(v4).toBe('awesome');
    });

    it('error', () => {
        const [v1, v2, v3, v4] = [r1, r2, r3, r4].map((m) => m.error());
        expect(v1).toBe(undefined);
        expect(v2).toBe(undefined);
        expect(v3).toBe('oops');
        expect(v4).toBe(undefined);
    });
});
