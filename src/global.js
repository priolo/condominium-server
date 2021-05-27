import { log, LOG_LEVEL } from "@priolo/jon-utils"


export const ENV_TYPE = {
	PRODUCTION: "production",
	DEVELOP: "develop",
	DEBUG: "debug",
}

export const Biblio = {
	inDebug: () => process.env.NODE_ENV == ENV_TYPE.DEBUG,
}

log.options.level = LOG_LEVEL.DEBUG