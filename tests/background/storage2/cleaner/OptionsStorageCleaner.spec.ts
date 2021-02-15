import { expect } from 'chai';

import { describeModuleTest } from '#/helpers/util';
import { MemoryStorage } from '#/stub/MemoryStorage';

import { Storage } from '@/background/storage2/Storage';

import {
	DisabledConnectors,
	ExtensionOptionsRepositoryData,
} from '@/background/repository/extension-options/ExtensionOptionsRepositoryData';
import { OptionsStorageCleaner } from '@/background/storage2/cleaner/OptionsStorageCleaner';

import { defaultExtensionOptions } from '@/background/repository/extension-options/DefaultExtensionOptions';

describeModuleTest(__filename, testOptionsStorageCleaner);

function testOptionsStorageCleaner() {
	const unknownConnectorId = 'unknown';
	const knownConnectorId = 'youtube';

	const storage = createOptionsStorage({
		[unknownConnectorId]: true,
		[knownConnectorId]: true,
	});
	const cleaner = new OptionsStorageCleaner();

	it('should have disabled connectors', async () => {
		const { disabledConnectors } = await storage.get();
		expect(disabledConnectors).to.be.not.deep.equal({});
	});

	it('should remove non-existing connector IDs', async () => {
		await cleaner.clean(storage);

		const { disabledConnectors } = await storage.get();
		expect(disabledConnectors).to.not.have.property(unknownConnectorId);
	});

	it('should keep existing connector IDs', async () => {
		await cleaner.clean(storage);

		const { disabledConnectors } = await storage.get();
		expect(disabledConnectors).to.have.property(knownConnectorId);
	});
}

function createOptionsStorage(
	disabledConnectors: DisabledConnectors
): Storage<ExtensionOptionsRepositoryData> {
	const defaultStorageData = {
		...defaultExtensionOptions,
		disabledConnectors,
	};

	return new MemoryStorage<ExtensionOptionsRepositoryData>(
		defaultStorageData
	);
}
