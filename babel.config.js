const {licenseBanner} = require('./defines/license-banner.js');
const {
    engines,
    browserslist,
    dependencies,
    devDependencies,
    peerDependencies
} = require('./package.json');

const findVersion = (name) => {
    const sources = [dependencies, devDependencies, peerDependencies];

    for (const source of sources) {
        if (!source) {
            continue;
        }

        const keys = Object.keys(source);

        for (const key of keys) {
            if (name instanceof RegExp) {
                if (name.test(key)) {
                    return source[key];
                }
            } else if (key === name) {
                return source[key];
            }
        }
    }

    return null;
};

const toExactVersion = (ver) => {
    return ver.replace(/[^0-9.]/g, '');
};

const getVersion = (name, exact) => {
    const ver = findVersion(name);

    if (!ver) {
        return undefined;
    }

    return exact ? toExactVersion(ver) : ver;
};

module.exports = function (api, options = {}) {
    const env = typeof options.env === 'string' ? options.env : api.env();

    const esm =
        typeof options.esm === 'boolean'
            ? options.esm
            : process.env.NPM_CONFIG_ESM !== 'false';

    const licenseNotice =
        env === 'production' &&
        process.env.NPM_CONFIG_SKIP_LICENSE_NOTICE !== 'true';

    const targets = {
        browsers: browserslist[env] || browserslist.development,
        node: toExactVersion(engines.node)
    };

    const transformRuntimeVersion = getVersion('@babel/runtime', false);

    const coreJSVersion = getVersion('core-js-pure', false);

    const signature = JSON.stringify({
        env,
        esm,
        licenseNotice,
        targets,
        transformRuntimeVersion,
        coreJSVersion
    });

    api.cache.using(() => signature);

    console.log('\n');
    console.log('BABEL CONFIG:');
    console.log('- ENV: ', env);
    console.log('- ESM: ', esm);
    console.log('- License Notice: ', licenseNotice);
    console.log('- Transform Runtime Version: ', transformRuntimeVersion);
    console.log('- CoreJS Version: ', coreJSVersion);
    console.log('\n');

    const presets = [
        [
            '@babel/preset-env',
            {
                spec: env === 'production',
                modules: esm && env !== 'test' ? false : 'auto',
                ignoreBrowserslistConfig: true
            }
        ]
    ];

    const plugins = [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-private-methods',
        '@babel/plugin-proposal-private-property-in-object'
    ];

    if (env === 'production') {
        plugins.push([
            '@babel/plugin-transform-runtime',
            {
                version: transformRuntimeVersion // https://babeljs.io/docs/en/babel-plugin-transform-runtime#version
            }
        ]);

        plugins.push([
            'polyfill-corejs3',
            {
                method: 'usage-pure',
                version: coreJSVersion
            }
        ]);
    }

    const ignore = [];

    if (env !== 'test') {
        ignore.push(/.+\.test\.(js|ts)x?$/);
        ignore.push(/.+jest\.setup\.(js|ts)x?$/);
    }

    if (env !== 'development') {
        ignore.push(/.+\.stories\.(js|ts)x?$/);
    }

    /*
     * USEFUL RESOURCES:
     * https://babeljs.io/docs/en/options#matchpattern
     */

    return {
        targets,
        browserslistConfigFile: false,
        sourceMaps: true, // https://github.com/babel/babel/issues/5261
        sourceType: 'module',
        ignore,
        presets,
        plugins,
        overrides: [
            {
                test: ['**/*.jsx', '**/*.tsx'],
                presets: [
                    [
                        '@babel/preset-react',
                        {
                            development: env === 'development',
                            runtime: 'automatic' // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#manual-babel-setup
                        }
                    ]
                ],
                plugins:
                    env === 'production'
                        ? ['babel-plugin-jsx-remove-data-test-id']
                        : []
            },
            {
                // THIS PRESET WILL JUST STRIP/TRANSFORM TYPESCRIPT SYNTAX WITHOUT PERFORMING ANY CHECK (AS EXPECTED). TYPECHECKING SHOULD BE PERFORMED WHEN BUILDING TYPE DECLARATIONS
                test: ['**/*.ts', '**/*.tsx'],
                presets: ['@babel/preset-typescript']
            },
            {
                // https://babeljs.io/docs/en/options#sourcetype
                test: [`${__dirname}/.yarn/**/*`, '**/node_modules/**/*'],
                sourceType: 'unambiguous'
            },
            {
                // https://github.com/babel/babel/issues/15363
                test: [`${__dirname}/src/**/*`],
                plugins: licenseNotice
                    ? [
                          [
                              './.babel/plugins/babel-plugin-license-banner/index.js',
                              {
                                  licenseBanner
                              }
                          ]
                      ]
                    : []
            }
        ]
    };
};
