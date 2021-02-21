import { expect } from 'chai';

import { getObjectKeys, describeModuleTest } from '#/helpers/util';
import { MemoryStorage } from '#/stub/MemoryStorage';

import { ConnectorsOptions } from '@/background/repository/connectors-options/ConnectorsOptions';
import { defaultConnectorsOptions } from '@/background/repository/connectors-options/DefaultConnectorsOptions';

describeModuleTest(__filename, () => {
	const connectorsOptions = createConnectorsOptions();

	it('should return default options when initialized', async () => {
		const connectorIds = getObjectKeys(defaultConnectorsOptions);

		for (const connectorId of connectorIds) {
			const optionKeys = getObjectKeys(
				defaultConnectorsOptions[connectorId]
			);

			for (const optionKey of optionKeys) {
				const optionValue =
					defaultConnectorsOptions[connectorId][optionKey];
				const actualValue = await connectorsOptions.getOption(
					connectorId,
					optionKey
				);
				expect(actualValue).to.be.equal(optionValue);
			}
		}
	});

	it('should set option for the connector', async () => {
		const expectedValue = true;
		await connectorsOptions.setOption(
			'youtube',
			'scrobbleMusicOnly',
			expectedValue
		);

		const actualValue = await connectorsOptions.getOption(
			'youtube',
			'scrobbleMusicOnly'
		);
		expect(actualValue).to.be.equal(expectedValue);
	});

	it('should set another option for the connector', async () => {
		const expectedValue = true;
		await connectorsOptions.setOption(
			'youtube',
			'scrobbleEntertainmentOnly',
			expectedValue
		);

		const actualValue = await connectorsOptions.getOption(
			'youtube',
			'scrobbleEntertainmentOnly'
		);
		expect(actualValue).to.be.equal(expectedValue);
	});

	it('should read first option for the connector', async () => {
		const actualValue = await connectorsOptions.getOption(
			'youtube',
			'scrobbleMusicOnly'
		);
		expect(actualValue).to.be.true;
	});
});

function createConnectorsOptions(): ConnectorsOptions {
	return new ConnectorsOptions(new MemoryStorage());
}
