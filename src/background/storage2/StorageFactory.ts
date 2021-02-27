import { Storage } from '@/background/storage2/Storage';

import { getStorageDumper } from '@/background/storage2/dumper/StorageDumperFactory';
import {
	createLocalStorage,
	createSyncStorage,
} from '@/background/storage2/namespace/NamespaceStorageFactory';
import Logger from 'js-logger';

/* Local */

export function createCoreStorage<D>(): Storage<D> {
	return withLog<D>(createLocalStorage, 'Core');
}

export function createEditedTracksStorage<D>(): Storage<D> {
	return withLog<D>(createLocalStorage, 'LocalCache');
}

export function createNotificationsStorage<D>(): Storage<D> {
	return withLog<D>(createLocalStorage, 'Notifications');
}

export function createAccountStorage<D>(scrobblerId: string): Storage<D> {
	return withLog<D>(createLocalStorage, scrobblerId, [
		'sessionID',
		'sessionName',
		'userProperties',
	]);
}

export function createScrobbleCacheStorage<D>(): Storage<D> {
	return withLog<D>(createLocalStorage, 'ScrobbleStorage');
}

/* Sync */

export function createCustomUrlPatternsStorage<D>(): Storage<D> {
	return withLog<D>(createSyncStorage, 'customPatterns');
}

export function createOptionsStorage<D>(): Storage<D> {
	return withLog<D>(createSyncStorage, 'Options');
}

export function createConnectorsOptionsStorage<D>(): Storage<D> {
	return withLog<D>(createSyncStorage, 'Connectors');
}

/* Internal */

type NamespaceStorageCreator = <D>(namespace: string) => Storage<D>;

function withLog<D>(
	creator: NamespaceStorageCreator,
	namespace: string,
	sensitiveProperties?: string[]
): Storage<D> {
	const storage = creator<D>(namespace);
	const storageDumper = getStorageDumper();

	storageDumper
		.getStorageRawData(storage, sensitiveProperties)
		.then((storageRepresentation) => {
			Logger.get('StorageFactory').debug(
				`Create storage: ${namespace}Storage =`,
				storageRepresentation
			);
		});

	return storage;
}
