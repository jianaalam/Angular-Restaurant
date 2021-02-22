/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/main", ["require", "exports", "tslib", "@angular/compiler-cli/ngcc/src/dependencies/commonjs_dependency_host", "@angular/compiler-cli/ngcc/src/dependencies/dependency_resolver", "@angular/compiler-cli/ngcc/src/dependencies/dts_dependency_host", "@angular/compiler-cli/ngcc/src/dependencies/esm_dependency_host", "@angular/compiler-cli/ngcc/src/dependencies/module_resolver", "@angular/compiler-cli/ngcc/src/dependencies/umd_dependency_host", "@angular/compiler-cli/ngcc/src/entry_point_finder/directory_walker_entry_point_finder", "@angular/compiler-cli/ngcc/src/entry_point_finder/entry_point_collector", "@angular/compiler-cli/ngcc/src/entry_point_finder/program_based_entry_point_finder", "@angular/compiler-cli/ngcc/src/entry_point_finder/targeted_entry_point_finder", "@angular/compiler-cli/ngcc/src/execution/analyze_entry_points", "@angular/compiler-cli/ngcc/src/execution/cluster/executor", "@angular/compiler-cli/ngcc/src/execution/create_compile_function", "@angular/compiler-cli/ngcc/src/execution/single_process_executor", "@angular/compiler-cli/ngcc/src/execution/tasks/completion", "@angular/compiler-cli/ngcc/src/locking/async_locker", "@angular/compiler-cli/ngcc/src/locking/lock_file_with_child_process/index", "@angular/compiler-cli/ngcc/src/locking/sync_locker", "@angular/compiler-cli/ngcc/src/ngcc_options", "@angular/compiler-cli/ngcc/src/packages/configuration", "@angular/compiler-cli/ngcc/src/packages/entry_point", "@angular/compiler-cli/ngcc/src/packages/entry_point_manifest", "@angular/compiler-cli/ngcc/src/writing/package_json_updater"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mainNgcc = void 0;
    var tslib_1 = require("tslib");
    var commonjs_dependency_host_1 = require("@angular/compiler-cli/ngcc/src/dependencies/commonjs_dependency_host");
    var dependency_resolver_1 = require("@angular/compiler-cli/ngcc/src/dependencies/dependency_resolver");
    var dts_dependency_host_1 = require("@angular/compiler-cli/ngcc/src/dependencies/dts_dependency_host");
    var esm_dependency_host_1 = require("@angular/compiler-cli/ngcc/src/dependencies/esm_dependency_host");
    var module_resolver_1 = require("@angular/compiler-cli/ngcc/src/dependencies/module_resolver");
    var umd_dependency_host_1 = require("@angular/compiler-cli/ngcc/src/dependencies/umd_dependency_host");
    var directory_walker_entry_point_finder_1 = require("@angular/compiler-cli/ngcc/src/entry_point_finder/directory_walker_entry_point_finder");
    var entry_point_collector_1 = require("@angular/compiler-cli/ngcc/src/entry_point_finder/entry_point_collector");
    var program_based_entry_point_finder_1 = require("@angular/compiler-cli/ngcc/src/entry_point_finder/program_based_entry_point_finder");
    var targeted_entry_point_finder_1 = require("@angular/compiler-cli/ngcc/src/entry_point_finder/targeted_entry_point_finder");
    var analyze_entry_points_1 = require("@angular/compiler-cli/ngcc/src/execution/analyze_entry_points");
    var executor_1 = require("@angular/compiler-cli/ngcc/src/execution/cluster/executor");
    var create_compile_function_1 = require("@angular/compiler-cli/ngcc/src/execution/create_compile_function");
    var single_process_executor_1 = require("@angular/compiler-cli/ngcc/src/execution/single_process_executor");
    var completion_1 = require("@angular/compiler-cli/ngcc/src/execution/tasks/completion");
    var async_locker_1 = require("@angular/compiler-cli/ngcc/src/locking/async_locker");
    var lock_file_with_child_process_1 = require("@angular/compiler-cli/ngcc/src/locking/lock_file_with_child_process/index");
    var sync_locker_1 = require("@angular/compiler-cli/ngcc/src/locking/sync_locker");
    var ngcc_options_1 = require("@angular/compiler-cli/ngcc/src/ngcc_options");
    var configuration_1 = require("@angular/compiler-cli/ngcc/src/packages/configuration");
    var entry_point_1 = require("@angular/compiler-cli/ngcc/src/packages/entry_point");
    var entry_point_manifest_1 = require("@angular/compiler-cli/ngcc/src/packages/entry_point_manifest");
    var package_json_updater_1 = require("@angular/compiler-cli/ngcc/src/writing/package_json_updater");
    function mainNgcc(options) {
        var _a = ngcc_options_1.getSharedSetup(options), basePath = _a.basePath, targetEntryPointPath = _a.targetEntryPointPath, propertiesToConsider = _a.propertiesToConsider, compileAllFormats = _a.compileAllFormats, logger = _a.logger, pathMappings = _a.pathMappings, async = _a.async, errorOnFailedEntryPoint = _a.errorOnFailedEntryPoint, enableI18nLegacyMessageIdFormat = _a.enableI18nLegacyMessageIdFormat, invalidateEntryPointManifest = _a.invalidateEntryPointManifest, fileSystem = _a.fileSystem, absBasePath = _a.absBasePath, projectPath = _a.projectPath, tsConfig = _a.tsConfig, getFileWriter = _a.getFileWriter;
        var config = new configuration_1.NgccConfiguration(fileSystem, projectPath);
        var dependencyResolver = getDependencyResolver(fileSystem, logger, config, pathMappings);
        var entryPointManifest = invalidateEntryPointManifest ?
            new entry_point_manifest_1.InvalidatingEntryPointManifest(fileSystem, config, logger) :
            new entry_point_manifest_1.EntryPointManifest(fileSystem, config, logger);
        // Bail out early if the work is already done.
        var supportedPropertiesToConsider = ensureSupportedProperties(propertiesToConsider);
        var absoluteTargetEntryPointPath = targetEntryPointPath !== undefined ?
            fileSystem.resolve(basePath, targetEntryPointPath) :
            null;
        var finder = getEntryPointFinder(fileSystem, logger, dependencyResolver, config, entryPointManifest, absBasePath, absoluteTargetEntryPointPath, pathMappings, options.findEntryPointsFromTsConfigProgram ? tsConfig : null, projectPath);
        if (finder instanceof targeted_entry_point_finder_1.TargetedEntryPointFinder &&
            !finder.targetNeedsProcessingOrCleaning(supportedPropertiesToConsider, compileAllFormats)) {
            logger.debug('The target entry-point has already been processed');
            return;
        }
        // Determine the number of workers to use and whether ngcc should run in parallel.
        var workerCount = async ? ngcc_options_1.getMaxNumberOfWorkers() : 1;
        var inParallel = workerCount > 1;
        var analyzeEntryPoints = analyze_entry_points_1.getAnalyzeEntryPointsFn(logger, finder, fileSystem, supportedPropertiesToConsider, compileAllFormats, propertiesToConsider, inParallel);
        // Create an updater that will actually write to disk.
        var pkgJsonUpdater = new package_json_updater_1.DirectPackageJsonUpdater(fileSystem);
        var fileWriter = getFileWriter(pkgJsonUpdater);
        // The function for creating the `compile()` function.
        var createCompileFn = create_compile_function_1.getCreateCompileFn(fileSystem, logger, fileWriter, enableI18nLegacyMessageIdFormat, tsConfig, pathMappings);
        // The executor for actually planning and getting the work done.
        var createTaskCompletedCallback = getCreateTaskCompletedCallback(pkgJsonUpdater, errorOnFailedEntryPoint, logger, fileSystem);
        var executor = getExecutor(async, workerCount, logger, fileWriter, pkgJsonUpdater, fileSystem, config, createTaskCompletedCallback);
        return executor.execute(analyzeEntryPoints, createCompileFn);
    }
    exports.mainNgcc = mainNgcc;
    function ensureSupportedProperties(properties) {
        var e_1, _a;
        // Short-circuit the case where `properties` has fallen back to the default value:
        // `SUPPORTED_FORMAT_PROPERTIES`
        if (properties === entry_point_1.SUPPORTED_FORMAT_PROPERTIES)
            return entry_point_1.SUPPORTED_FORMAT_PROPERTIES;
        var supportedProperties = [];
        try {
            for (var _b = tslib_1.__values(properties), _c = _b.next(); !_c.done; _c = _b.next()) {
                var prop = _c.value;
                if (entry_point_1.SUPPORTED_FORMAT_PROPERTIES.indexOf(prop) !== -1) {
                    supportedProperties.push(prop);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (supportedProperties.length === 0) {
            throw new Error("No supported format property to consider among [" + properties.join(', ') + "]. " +
                ("Supported properties: " + entry_point_1.SUPPORTED_FORMAT_PROPERTIES.join(', ')));
        }
        return supportedProperties;
    }
    function getCreateTaskCompletedCallback(pkgJsonUpdater, errorOnFailedEntryPoint, logger, fileSystem) {
        return function (taskQueue) {
            var _a;
            return completion_1.composeTaskCompletedCallbacks((_a = {},
                _a[0 /* Processed */] = completion_1.createMarkAsProcessedHandler(fileSystem, pkgJsonUpdater),
                _a[1 /* Failed */] = errorOnFailedEntryPoint ? completion_1.createThrowErrorHandler(fileSystem) :
                    completion_1.createLogErrorHandler(logger, fileSystem, taskQueue),
                _a));
        };
    }
    function getExecutor(async, workerCount, logger, fileWriter, pkgJsonUpdater, fileSystem, config, createTaskCompletedCallback) {
        var lockFile = new lock_file_with_child_process_1.LockFileWithChildProcess(fileSystem, logger);
        if (async) {
            // Execute asynchronously (either serially or in parallel)
            var _a = config.getLockingConfig(), retryAttempts = _a.retryAttempts, retryDelay = _a.retryDelay;
            var locker = new async_locker_1.AsyncLocker(lockFile, logger, retryDelay, retryAttempts);
            if (workerCount > 1) {
                // Execute in parallel.
                return new executor_1.ClusterExecutor(workerCount, fileSystem, logger, fileWriter, pkgJsonUpdater, locker, createTaskCompletedCallback);
            }
            else {
                // Execute serially, on a single thread (async).
                return new single_process_executor_1.SingleProcessExecutorAsync(logger, locker, createTaskCompletedCallback);
            }
        }
        else {
            // Execute serially, on a single thread (sync).
            return new single_process_executor_1.SingleProcessExecutorSync(logger, new sync_locker_1.SyncLocker(lockFile), createTaskCompletedCallback);
        }
    }
    function getDependencyResolver(fileSystem, logger, config, pathMappings) {
        var moduleResolver = new module_resolver_1.ModuleResolver(fileSystem, pathMappings);
        var esmDependencyHost = new esm_dependency_host_1.EsmDependencyHost(fileSystem, moduleResolver);
        var umdDependencyHost = new umd_dependency_host_1.UmdDependencyHost(fileSystem, moduleResolver);
        var commonJsDependencyHost = new commonjs_dependency_host_1.CommonJsDependencyHost(fileSystem, moduleResolver);
        var dtsDependencyHost = new dts_dependency_host_1.DtsDependencyHost(fileSystem, pathMappings);
        return new dependency_resolver_1.DependencyResolver(fileSystem, logger, config, {
            esm5: esmDependencyHost,
            esm2015: esmDependencyHost,
            umd: umdDependencyHost,
            commonjs: commonJsDependencyHost
        }, dtsDependencyHost);
    }
    function getEntryPointFinder(fs, logger, resolver, config, entryPointManifest, basePath, absoluteTargetEntryPointPath, pathMappings, tsConfig, projectPath) {
        if (absoluteTargetEntryPointPath !== null) {
            return new targeted_entry_point_finder_1.TargetedEntryPointFinder(fs, config, logger, resolver, basePath, pathMappings, absoluteTargetEntryPointPath);
        }
        else {
            var entryPointCollector = new entry_point_collector_1.EntryPointCollector(fs, config, logger, resolver);
            if (tsConfig !== null) {
                return new program_based_entry_point_finder_1.ProgramBasedEntryPointFinder(fs, config, logger, resolver, entryPointCollector, entryPointManifest, basePath, tsConfig, projectPath);
            }
            else {
                return new directory_walker_entry_point_finder_1.DirectoryWalkerEntryPointFinder(logger, resolver, entryPointCollector, entryPointManifest, basePath, pathMappings);
            }
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7SUFRSCxpSEFBK0U7SUFDL0UsdUdBQXNFO0lBQ3RFLHVHQUFxRTtJQUNyRSx1R0FBcUU7SUFDckUsK0ZBQThEO0lBQzlELHVHQUFxRTtJQUNyRSw2SUFBeUc7SUFDekcsaUhBQStFO0lBRS9FLHVJQUFtRztJQUNuRyw2SEFBMEY7SUFDMUYsc0dBQXlFO0lBRXpFLHNGQUE2RDtJQUM3RCw0R0FBdUU7SUFDdkUsNEdBQTBHO0lBRTFHLHdGQUF5SjtJQUN6SixvRkFBbUQ7SUFDbkQsMEhBQWdGO0lBQ2hGLGtGQUFpRDtJQUNqRCw0RUFBd0c7SUFDeEcsdUZBQTJEO0lBQzNELG1GQUEyRjtJQUMzRixxR0FBbUc7SUFHbkcsb0dBQTRGO0lBWTVGLFNBQWdCLFFBQVEsQ0FBQyxPQUF5QztRQUMxRCxJQUFBLEtBZ0JGLDZCQUFjLENBQUMsT0FBTyxDQUFDLEVBZnpCLFFBQVEsY0FBQSxFQUNSLG9CQUFvQiwwQkFBQSxFQUNwQixvQkFBb0IsMEJBQUEsRUFDcEIsaUJBQWlCLHVCQUFBLEVBQ2pCLE1BQU0sWUFBQSxFQUNOLFlBQVksa0JBQUEsRUFDWixLQUFLLFdBQUEsRUFDTCx1QkFBdUIsNkJBQUEsRUFDdkIsK0JBQStCLHFDQUFBLEVBQy9CLDRCQUE0QixrQ0FBQSxFQUM1QixVQUFVLGdCQUFBLEVBQ1YsV0FBVyxpQkFBQSxFQUNYLFdBQVcsaUJBQUEsRUFDWCxRQUFRLGNBQUEsRUFDUixhQUFhLG1CQUNZLENBQUM7UUFFNUIsSUFBTSxNQUFNLEdBQUcsSUFBSSxpQ0FBaUIsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDOUQsSUFBTSxrQkFBa0IsR0FBRyxxQkFBcUIsQ0FBQyxVQUFVLEVB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WUFDdEIsUUFBUSxFQUFFLHNCQUFzQjtTQUNqQyxFQUNELGlCQUFpQixDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELFNBQVMsbUJBQW1CLENBQ3hCLEVBQXNCLEVBQUUsTUFBYyxFQUFFLFFBQTRCLEVBQUUsTUFBeUIsRUFDL0Ysa0JBQXNDLEVBQUUsUUFBd0IsRUFDaEUsNEJBQWlELEVBQUUsWUFBb0MsRUFDdkYsUUFBa0MsRUFBRSxXQUEyQjtRQUNqRSxJQUFJLDRCQUE0QixLQUFLLElBQUksRUFBRTtZQUN6QyxPQUFPLElBQUksc0RBQXdCLENBQy9CLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLDRCQUE0QixDQUFDLENBQUM7U0FDekY7YUFBTTtZQUNMLElBQU0sbUJBQW1CLEdBQUcsSUFBSSwyQ0FBbUIsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNsRixJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7Z0JBQ3JCLE9BQU8sSUFBSSwrREFBNEIsQ0FDbkMsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQ3pGLFdBQVcsQ0FBQyxDQUFDO2FBQ2xCO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxxRUFBK0IsQ0FDdEMsTUFBTSxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7YUFDeEY7U0FDRjtJQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJub2RlXCIgLz5cblxuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgRmlsZVN5c3RlbSwgUmVhZG9ubHlGaWxlU3lzdGVtfSBmcm9tICcuLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3NyYy9uZ3RzYy9sb2dnaW5nJztcbmltcG9ydCB7UGFyc2VkQ29uZmlndXJhdGlvbn0gZnJvbSAnLi4vLi4vc3JjL3BlcmZvcm1fY29tcGlsZSc7XG5cbmltcG9ydCB7Q29tbW9uSnNEZXBlbmRlbmN5SG9zdH0gZnJvbSAnLi9kZXBlbmRlbmNpZXMvY29tbW9uanNfZGVwZW5kZW5jeV9ob3N0JztcbmltcG9ydCB7RGVwZW5kZW5jeVJlc29sdmVyfSBmcm9tICcuL2RlcGVuZGVuY2llcy9kZXBlbmRlbmN5X3Jlc29sdmVyJztcbmltcG9ydCB7RHRzRGVwZW5kZW5jeUhvc3R9IGZyb20gJy4vZGVwZW5kZW5jaWVzL2R0c19kZXBlbmRlbmN5X2hvc3QnO1xuaW1wb3J0IHtFc21EZXBlbmRlbmN5SG9zdH0gZnJvbSAnLi9kZXBlbmRlbmNpZXMvZXNtX2RlcGVuZGVuY3lfaG9zdCc7XG5pbXBvcnQge01vZHVsZVJlc29sdmVyfSBmcm9tICcuL2RlcGVuZGVuY2llcy9tb2R1bGVfcmVzb2x2ZXInO1xuaW1wb3J0IHtVbWREZXBlbmRlbmN5SG9zdH0gZnJvbSAnLi9kZXBlbmRlbmNpZXMvdW1kX2RlcGVuZGVuY3lfaG9zdCc7XG5pbXBvcnQge0RpcmVjdG9yeVdhbGtlckVudHJ5UG9pbnRGaW5kZXJ9IGZyb20gJy4vZW50cnlfcG9pbnRfZmluZGVyL2RpcmVjdG9yeV93YWxrZXJfZW50cnlfcG9pbnRfZmluZGVyJztcbmltcG9ydCB7RW50cnlQb2ludENvbGxlY3Rvcn0gZnJvbSAnLi9lbnRyeV9wb2ludF9maW5kZXIvZW50cnlfcG9pbnRfY29sbGVjdG9yJztcbmltcG9ydCB7RW50cnlQb2ludEZpbmRlcn0gZnJvbSAnLi9lbnRyeV9wb2ludF9maW5kZXIvaW50ZXJmYWNlJztcbmltcG9ydCB7UHJvZ3JhbUJhc2VkRW50cnlQb2ludEZpbmRlcn0gZnJvbSAnLi9lbnRyeV9wb2ludF9maW5kZXIvcHJvZ3JhbV9iYXNlZF9lbnRyeV9wb2ludF9maW5kZXInO1xuaW1wb3J0IHtUYXJnZXRlZEVudHJ5UG9pbnRGaW5kZXJ9IGZyb20gJy4vZW50cnlfcG9pbnRfZmluZGVyL3RhcmdldGVkX2VudHJ5X3BvaW50X2ZpbmRlcic7XG5pbXBvcnQge2dldEFuYWx5emVFbnRyeVBvaW50c0ZufSBmcm9tICcuL2V4ZWN1dGlvbi9hbmFseXplX2VudHJ5X3BvaW50cyc7XG5pbXBvcnQge0V4ZWN1dG9yfSBmcm9tICcuL2V4ZWN1dGlvbi9hcGknO1xuaW1wb3J0IHtDbHVzdGVyRXhlY3V0b3J9IGZyb20gJy4vZXhlY3V0aW9uL2NsdXN0ZXIvZXhlY3V0b3InO1xuaW1wb3J0IHtnZXRDcmVhdGVDb21waWxlRm59IGZyb20gJy4vZXhlY3V0aW9uL2NyZWF0ZV9jb21waWxlX2Z1bmN0aW9uJztcbmltcG9ydCB7U2luZ2xlUHJvY2Vzc0V4ZWN1dG9yQXN5bmMsIFNpbmdsZVByb2Nlc3NFeGVjdXRvclN5bmN9IGZyb20gJy4vZXhlY3V0aW9uL3NpbmdsZV9wcm9jZXNzX2V4ZWN1dG9yJztcbmltcG9ydCB7Q3JlYXRlVGFza0NvbXBsZXRlZENhbGxiYWNrLCBUYXNrUHJvY2Vzc2luZ091dGNvbWV9IGZyb20gJy4vZXhlY3V0aW9uL3Rhc2tzL2FwaSc7XG5pbXBvcnQge2NvbXBvc2VUYXNrQ29tcGxldGVkQ2FsbGJhY2tzLCBjcmVhdGVMb2dFcnJvckhhbmRsZXIsIGNyZWF0ZU1hcmtBc1Byb2Nlc3NlZEhhbmRsZXIsIGNyZWF0ZVRocm93RXJyb3JIYW5kbGVyfSBmcm9tICcuL2V4ZWN1dGlvbi90YXNrcy9jb21wbGV0aW9uJztcbmltcG9ydCB7QXN5bmNMb2NrZXJ9IGZyb20gJy4vbG9ja2luZy9hc3luY19sb2NrZXInO1xuaW1wb3J0IHtMb2NrRmlsZVdpdGhDaGlsZFByb2Nlc3N9IGZyb20gJy4vbG9ja2luZy9sb2NrX2ZpbGVfd2l0aF9jaGlsZF9wcm9jZXNzJztcbmltcG9ydCB7U3luY0xvY2tlcn0gZnJvbSAnLi9sb2NraW5nL3N5bmNfbG9ja2VyJztcbmltcG9ydCB7QXN5bmNOZ2NjT3B0aW9ucywgZ2V0TWF4TnVtYmVyT2ZXb3JrZXJzLCBnZXRTaGFyZWRTZXR1cCwgU3luY05nY2NPcHRpb25zfSBmcm9tICcuL25nY2Nfb3B0aW9ucyc7XG5pbXBvcnQge05nY2NDb25maWd1cmF0aW9ufSBmcm9tICcuL3BhY2thZ2VzL2NvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IHtFbnRyeVBvaW50SnNvblByb3BlcnR5LCBTVVBQT1JURURfRk9STUFUX1BST1BFUlRJRVN9IGZyb20gJy4vcGFja2FnZXMvZW50cnlfcG9pbnQnO1xuaW1wb3J0IHtFbnRyeVBvaW50TWFuaWZlc3QsIEludmFsaWRhdGluZ0VudHJ5UG9pbnRNYW5pZmVzdH0gZnJvbSAnLi9wYWNrYWdlcy9lbnRyeV9wb2ludF9tYW5pZmVzdCc7XG5pbXBvcnQge1BhdGhNYXBwaW5nc30gZnJvbSAnLi9wYXRoX21hcHBpbmdzJztcbmltcG9ydCB7RmlsZVdyaXRlcn0gZnJvbSAnLi93cml0aW5nL2ZpbGVfd3JpdGVyJztcbmltcG9ydCB7RGlyZWN0UGFja2FnZUpzb25VcGRhdGVyLCBQYWNrYWdlSnNvblVwZGF0ZXJ9IGZyb20gJy4vd3JpdGluZy9wYWNrYWdlX2pzb25fdXBkYXRlcic7XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgbWFpbiBlbnRyeS1wb2ludCBpbnRvIG5nY2MgKGFOR3VsYXIgQ29tcGF0aWJpbGl0eSBDb21waWxlcikuXG4gKlxuICogWW91IGNhbiBjYWxsIHRoaXMgZnVuY3Rpb24gdG8gcHJvY2VzcyBvbmUgb3IgbW9yZSBucG0gcGFja2FnZXMsIHRvIGVuc3VyZVxuICogdGhhdCB0aGV5IGFyZSBjb21wYXRpYmxlIHdpdGggdGhlIGl2eSBjb21waWxlciAobmd0c2MpLlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIFRoZSBvcHRpb25zIHRlbGxpbmcgbmdjYyB3aGF0IHRvIGNvbXBpbGUgYW5kIGhvdy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1haW5OZ2NjPFQgZXh0ZW5kcyBBc3luY05nY2NPcHRpb25zfFN5bmNOZ2NjT3B0aW9ucz4ob3B0aW9uczogVCk6XG4gICAgVCBleHRlbmRzIEFzeW5jTmdjY09wdGlvbnMgPyBQcm9taXNlPHZvaWQ+OiB2b2lkO1xuZXhwb3J0IGZ1bmN0aW9uIG1haW5OZ2NjKG9wdGlvbnM6IEFzeW5jTmdjY09wdGlvbnN8U3luY05nY2NPcHRpb25zKTogdm9pZHxQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qge1xuICAgIGJhc2VQYXRoLFxuICAgIHRhcmdldEVudHJ5UG9pbnRQYXRoLFxuICAgIHByb3BlcnRpZXNUb0NvbnNpZGVyLFxuICAgIGNvbXBpbGVBbGxGb3JtYXRzLFxuICAgIGxvZ2dlcixcbiAgICBwYXRoTWFwcGluZ3MsXG4gICAgYXN5bmMsXG4gICAgZXJyb3JPbkZhaWxlZEVudHJ5UG9pbnQsXG4gICAgZW5hYmxlSTE4bkxlZ2FjeU1lc3NhZ2VJZEZvcm1hdCxcbiAgICBpbnZhbGlkYXRlRW50cnlQb2ludE1hbmlmZXN0LFxuICAgIGZpbGVTeXN0ZW0sXG4gICAgYWJzQmFzZVBhdGgsXG4gICAgcHJvamVjdFBhdGgsXG4gICAgdHNDb25maWcsXG4gICAgZ2V0RmlsZVdyaXRlcixcbiAgfSA9IGdldFNoYXJlZFNldHVwKG9wdGlvbnMpO1xuXG4gIGNvbnN0IGNvbmZpZyA9IG5ldyBOZ2NjQ29uZmlndXJhdGlvbihmaWxlU3lzdGVtLCBwcm9qZWN0UGF0aCk7XG4gIGNvbnN0IGRlcGVuZGVuY3lSZXNvbHZlciA9IGdldERlcGVuZGVuY3lSZXNvbHZlcihmaWxlU3lzdGVtLCBsb2dnZXIsIGNvbmZpZywgcGF0aE1hcHBpbmdzKTtcbiAgY29uc3QgZW50cnlQb2ludE1hbmlmZXN0ID0gaW52YWxpZGF0ZUVudHJ5UG9pbnRNYW5pZmVzdCA/XG4gICAgICBuZXcgSW52YWxpZGF0aW5nRW50cnlQb2ludE1hbmlmZXN0KGZpbGVTeXN0ZW0sIGNvbmZpZywgbG9nZ2VyKSA6XG4gICAgICBuZXcgRW50cnlQb2ludE1hbmlmZXN0KGZpbGVTeXN0ZW0sIGNvbmZpZywgbG9nZ2VyKTtcblxuICAvLyBCYWlsIG91dCBlYXJseSBpZiB0aGUgd29yayBpcyBhbHJlYWR5IGRvbmUuXG4gIGNvbnN0IHN1cHBvcnRlZFByb3BlcnRpZXNUb0NvbnNpZGVyID0gZW5zdXJlU3VwcG9ydGVkUHJvcGVydGllcyhwcm9wZXJ0aWVzVG9Db25zaWRlcik7XG4gIGNvbnN0IGFic29sdXRlVGFyZ2V0RW50cnlQb2ludFBhdGggPSB0YXJnZXRFbnRyeVBvaW50UGF0aCAhPT0gdW5kZWZpbmVkID9cbiAgICAgIGZpbGVTeXN0ZW0ucmVzb2x2ZShiYXNlUGF0aCwgdGFyZ2V0RW50cnlQb2ludFBhdGgpIDpcbiAgICAgIG51bGw7XG4gIGNvbnN0IGZpbmRlciA9IGdldEVudHJ5UG9pbnRGaW5kZXIoXG4gICAgICBmaWxlU3lzdGVtLCBsb2dnZXIsIGRlcGVuZGVuY3lSZXNvbHZlciwgY29uZmlnLCBlbnRyeVBvaW50TWFuaWZlc3QsIGFic0Jhc2VQYXRoLFxuICAgICAgYWJzb2x1dGVUYXJnZXRFbnRyeVBvaW50UGF0aCwgcGF0aE1hcHBpbmdzLFxuICAgICAgb3B0aW9ucy5maW5kRW50cnlQb2ludHNGcm9tVHNDb25maWdQcm9ncmFtID8gdHNDb25maWcgOiBudWxsLCBwcm9qZWN0UGF0aCk7XG4gIGlmIChmaW5kZXIgaW5zdGFuY2VvZiBUYXJnZXRlZEVudHJ5UG9pbnRGaW5kZXIgJiZcbiAgICAgICFmaW5kZXIudGFyZ2V0TmVlZHNQcm9jZXNzaW5nT3JDbGVhbmluZyhzdXBwb3J0ZWRQcm9wZXJ0aWVzVG9Db25zaWRlciwgY29tcGlsZUFsbEZvcm1hdHMpKSB7XG4gICAgbG9nZ2VyLmRlYnVnKCdUaGUgdGFyZ2V0IGVudHJ5LXBvaW50IGhhcyBhbHJlYWR5IGJlZW4gcHJvY2Vzc2VkJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGV0ZXJtaW5lIHRoZSBudW1iZXIgb2Ygd29ya2VycyB0byB1c2UgYW5kIHdoZXRoZXIgbmdjYyBzaG91bGQgcnVuIGluIHBhcmFsbGVsLlxuICBjb25zdCB3b3JrZXJDb3VudCA9IGFzeW5jID8gZ2V0TWF4TnVtYmVyT2ZXb3JrZXJzKCkgOiAxO1xuICBjb25zdCBpblBhcmFsbGVsID0gd29ya2VyQ291bnQgPiAxO1xuXG4gIGNvbnN0IGFuYWx5emVFbnRyeVBvaW50cyA9IGdldEFuYWx5emVFbnRyeVBvaW50c0ZuKFxuICAgICAgbG9nZ2VyLCBmaW5kZXIsIGZpbGVTeXN0ZW0sIHN1cHBvcnRlZFByb3BlcnRpZXNUb0NvbnNpZGVyLCBjb21waWxlQWxsRm9ybWF0cyxcbiAgICAgIHByb3BlcnRpZXNUb0NvbnNpZGVyLCBpblBhcmFsbGVsKTtcblxuICAvLyBDcmVhdGUgYW4gdXBkYXRlciB0aGF0IHdpbGwgYWN0dWFsbHkgd3JpdGUgdG8gZGlzay5cbiAgY29uc3QgcGtnSnNvblVwZGF0ZXIgPSBuZXcgRGlyZWN0UGFja2FnZUpzb25VcGRhdGVyKGZpbGVTeXN0ZW0pO1xuICBjb25zdCBmaWxlV3JpdGVyID0gZ2V0RmlsZVdyaXRlcihwa2dKc29uVXBkYXRlcik7XG5cbiAgLy8gVGhlIGZ1bmN0aW9uIGZvciBjcmVhdGluZyB0aGUgYGNvbXBpbGUoKWAgZnVuY3Rpb24uXG4gIGNvbnN0IGNyZWF0ZUNvbXBpbGVGbiA9IGdldENyZWF0ZUNvbXBpbGVGbihcbiAgICAgIGZpbGVTeXN0ZW0sIGxvZ2dlciwgZmlsZVdyaXRlciwgZW5hYmxlSTE4bkxlZ2FjeU1lc3NhZ2VJZEZvcm1hdCwgdHNDb25maWcsIHBhdGhNYXBwaW5ncyk7XG5cbiAgLy8gVGhlIGV4ZWN1dG9yIGZvciBhY3R1YWxseSBwbGFubmluZyBhbmQgZ2V0dGluZyB0aGUgd29yayBkb25lLlxuICBjb25zdCBjcmVhdGVUYXNrQ29tcGxldGVkQ2FsbGJhY2sgPVxuICAgICAgZ2V0Q3JlYXRlVGFza0NvbXBsZXRlZENhbGxiYWNrKHBrZ0pzb25VcGRhdGVyLCBlcnJvck9uRmFpbGVkRW50cnlQb2ludCwgbG9nZ2VyLCBmaWxlU3lzdGVtKTtcbiAgY29uc3QgZXhlY3V0b3IgPSBnZXRFeGVjdXRvcihcbiAgICAgIGFzeW5jLCB3b3JrZXJDb3VudCwgbG9nZ2VyLCBmaWxlV3JpdGVyLCBwa2dKc29uVXBkYXRlciwgZmlsZVN5c3RlbSwgY29uZmlnLFxuICAgICAgY3JlYXRlVGFza0NvbXBsZXRlZENhbGxiYWNrKTtcblxuICByZXR1cm4gZXhlY3V0b3IuZXhlY3V0ZShhbmFseXplRW50cnlQb2ludHMsIGNyZWF0ZUNvbXBpbGVGbik7XG59XG5cbmZ1bmN0aW9uIGVuc3VyZVN1cHBvcnRlZFByb3BlcnRpZXMocHJvcGVydGllczogc3RyaW5nW10pOiBFbnRyeVBvaW50SnNvblByb3BlcnR5W10ge1xuICAvLyBTaG9ydC1jaXJjdWl0IHRoZSBjYXNlIHdoZXJlIGBwcm9wZXJ0aWVzYCBoYXMgZmFsbGVuIGJhY2sgdG8gdGhlIGRlZmF1bHQgdmFsdWU6XG4gIC8vIGBTVVBQT1JURURfRk9STUFUX1BST1BFUlRJRVNgXG4gIGlmIChwcm9wZXJ0aWVzID09PSBTVVBQT1JURURfRk9STUFUX1BST1BFUlRJRVMpIHJldHVybiBTVVBQT1JURURfRk9STUFUX1BST1BFUlRJRVM7XG5cbiAgY29uc3Qgc3VwcG9ydGVkUHJvcGVydGllczogRW50cnlQb2ludEpzb25Qcm9wZXJ0eVtdID0gW107XG5cbiAgZm9yIChjb25zdCBwcm9wIG9mIHByb3BlcnRpZXMgYXMgRW50cnlQb2ludEpzb25Qcm9wZXJ0eVtdKSB7XG4gICAgaWYgKFNVUFBPUlRFRF9GT1JNQVRfUFJPUEVSVElFUy5pbmRleE9mKHByb3ApICE9PSAtMSkge1xuICAgICAgc3VwcG9ydGVkUHJvcGVydGllcy5wdXNoKHByb3ApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0ZWRQcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYE5vIHN1cHBvcnRlZCBmb3JtYXQgcHJvcGVydHkgdG8gY29uc2lkZXIgYW1vbmcgWyR7cHJvcGVydGllcy5qb2luKCcsICcpfV0uIGAgK1xuICAgICAgICBgU3VwcG9ydGVkIHByb3BlcnRpZXM6ICR7U1VQUE9SVEVEX0ZPUk1BVF9QUk9QRVJUSUVTLmpvaW4oJywgJyl9YCk7XG4gIH1cblxuICByZXR1cm4gc3VwcG9ydGVkUHJvcGVydGllcztcbn1cblxuZnVuY3Rpb24gZ2V0Q3JlYXRlVGFza0NvbXBsZXRlZENhbGxiYWNrKFxuICAgIHBrZ0pzb25VcGRhdGVyOiBQYWNrYWdlSnNvblVwZGF0ZXIsIGVycm9yT25GYWlsZWRFbnRyeVBvaW50OiBib29sZWFuLCBsb2dnZXI6IExvZ2dlcixcbiAgICBmaWxlU3lzdGVtOiBSZWFkb25seUZpbGVTeXN0ZW0pOiBDcmVhdGVUYXNrQ29tcGxldGVkQ2FsbGJhY2sge1xuICByZXR1cm4gdGFza1F1ZXVlID0+IGNvbXBvc2VUYXNrQ29tcGxldGVkQ2FsbGJhY2tzKHtcbiAgICAgICAgICAgW1Rhc2tQcm9jZXNzaW5nT3V0Y29tZS5Qcm9jZXNzZWRdOlxuICAgICAgICAgICAgICAgY3JlYXRlTWFya0FzUHJvY2Vzc2VkSGFuZGxlcihmaWxlU3lzdGVtLCBwa2dKc29uVXBkYXRlciksXG4gICAgICAgICAgIFtUYXNrUHJvY2Vzc2luZ091dGNvbWUuRmFpbGVkXTpcbiAgICAgICAgICAgICAgIGVycm9yT25GYWlsZWRFbnRyeVBvaW50ID8gY3JlYXRlVGhyb3dFcnJvckhhbmRsZXIoZmlsZVN5c3RlbSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVMb2dFcnJvckhhbmRsZXIobG9nZ2VyLCBmaWxlU3lzdGVtLCB0YXNrUXVldWUpLFxuICAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEV4ZWN1dG9yKFxuICAgIGFzeW5jOiBib29sZWFuLCB3b3JrZXJDb3VudDogbnVtYmVyLCBsb2dnZXI6IExvZ2dlciwgZmlsZVdyaXRlcjogRmlsZVdyaXRlcixcbiAgICBwa2dKc29uVXBkYXRlcjogUGFja2FnZUpzb25VcGRhdGVyLCBmaWxlU3lzdGVtOiBGaWxlU3lzdGVtLCBjb25maWc6IE5nY2NDb25maWd1cmF0aW9uLFxuICAgIGNyZWF0ZVRhc2tDb21wbGV0ZWRDYWxsYmFjazogQ3JlYXRlVGFza0NvbXBsZXRlZENhbGxiYWNrKTogRXhlY3V0b3Ige1xuICBjb25zdCBsb2NrRmlsZSA9IG5ldyBMb2NrRmlsZVdpdGhDaGlsZFByb2Nlc3MoZmlsZVN5c3RlbSwgbG9nZ2VyKTtcbiAgaWYgKGFzeW5jKSB7XG4gICAgLy8gRXhlY3V0ZSBhc3luY2hyb25vdXNseSAoZWl0aGVyIHNlcmlhbGx5IG9yIGluIHBhcmFsbGVsKVxuICAgIGNvbnN0IHtyZXRyeUF0dGVtcHRzLCByZXRyeURlbGF5fSA9IGNvbmZpZy5nZXRMb2NraW5nQ29uZmlnKCk7XG4gICAgY29uc3QgbG9ja2VyID0gbmV3IEFzeW5jTG9ja2VyKGxvY2tGaWxlLCBsb2dnZXIsIHJldHJ5RGVsYXksIHJldHJ5QXR0ZW1wdHMpO1xuICAgIGlmICh3b3JrZXJDb3VudCA+IDEpIHtcbiAgICAgIC8vIEV4ZWN1dGUgaW4gcGFyYWxsZWwuXG4gICAgICByZXR1cm4gbmV3IENsdXN0ZXJFeGVjdXRvcihcbiAgICAgICAgICB3b3JrZXJDb3VudCwgZmlsZVN5c3RlbSwgbG9nZ2VyLCBmaWxlV3JpdGVyLCBwa2dKc29uVXBkYXRlciwgbG9ja2VyLFxuICAgICAgICAgIGNyZWF0ZVRhc2tDb21wbGV0ZWRDYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEV4ZWN1dGUgc2VyaWFsbHksIG9uIGEgc2luZ2xlIHRocmVhZCAoYXN5bmMpLlxuICAgICAgcmV0dXJuIG5ldyBTaW5nbGVQcm9jZXNzRXhlY3V0b3JBc3luYyhsb2dnZXIsIGxvY2tlciwgY3JlYXRlVGFza0NvbXBsZXRlZENhbGxiYWNrKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gRXhlY3V0ZSBzZXJpYWxseSwgb24gYSBzaW5nbGUgdGhyZWFkIChzeW5jKS5cbiAgICByZXR1cm4gbmV3IFNpbmdsZVByb2Nlc3NFeGVjdXRvclN5bmMoXG4gICAgICAgIGxvZ2dlciwgbmV3IFN5bmNMb2NrZXIobG9ja0ZpbGUpLCBjcmVhdGVUYXNrQ29tcGxldGVkQ2FsbGJhY2spO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlcGVuZGVuY3lSZXNvbHZlcihcbiAgICBmaWxlU3lzdGVtOiBSZWFkb25seUZpbGVTeXN0ZW0sIGxvZ2dlcjogTG9nZ2VyLCBjb25maWc6IE5nY2NDb25maWd1cmF0aW9uLFxuICAgIHBhdGhNYXBwaW5nczogUGF0aE1hcHBpbmdzfHVuZGVmaW5lZCk6IERlcGVuZGVuY3lSZXNvbHZlciB7XG4gIGNvbnN0IG1vZHVsZVJlc29sdmVyID0gbmV3IE1vZHVsZVJlc29sdmVyKGZpbGVTeXN0ZW0sIHBhdGhNYXBwaW5ncyk7XG4gIGNvbnN0IGVzbURlcGVuZGVuY3lIb3N0ID0gbmV3IEVzbURlcGVuZGVuY3lIb3N0KGZpbGVTeXN0ZW0sIG1vZHVsZVJlc29sdmVyKTtcbiAgY29uc3QgdW1kRGVwZW5kZW5jeUhvc3QgPSBuZXcgVW1kRGVwZW5kZW5jeUhvc3QoZmlsZVN5c3RlbSwgbW9kdWxlUmVzb2x2ZXIpO1xuICBjb25zdCBjb21tb25Kc0RlcGVuZGVuY3lIb3N0ID0gbmV3IENvbW1vbkpzRGVwZW5kZW5jeUhvc3QoZmlsZVN5c3RlbSwgbW9kdWxlUmVzb2x2ZXIpO1xuICBjb25zdCBkdHNEZXBlbmRlbmN5SG9zdCA9IG5ldyBEdHNEZXBlbmRlbmN5SG9zdChmaWxlU3lzdGVtLCBwYXRoTWFwcGluZ3MpO1xuICByZXR1cm4gbmV3IERlcGVuZGVuY3lSZXNvbHZlcihcbiAgICAgIGZpbGVTeXN0ZW0sIGxvZ2dlciwgY29uZmlnLCB7XG4gICAgICAgIGVzbTU6IGVzbURlcGVuZGVuY3lIb3N0LFxuICAgICAgICBlc20yMDE1OiBlc21EZXBlbmRlbmN5SG9zdCxcbiAgICAgICAgdW1kOiB1bWREZXBlbmRlbmN5SG9zdCxcbiAgICAgICAgY29tbW9uanM6IGNvbW1vbkpzRGVwZW5kZW5jeUhvc3RcbiAgICAgIH0sXG4gICAgICBkdHNEZXBlbmRlbmN5SG9zdCk7XG59XG5cbmZ1bmN0aW9uIGdldEVudHJ5UG9pbnRGaW5kZXIoXG4gICAgZnM6IFJlYWRvbmx5RmlsZVN5c3RlbSwgbG9nZ2VyOiBMb2dnZXIsIHJlc29sdmVyOiBEZXBlbmRlbmN5UmVzb2x2ZXIsIGNvbmZpZzogTmdjY0NvbmZpZ3VyYXRpb24sXG4gICAgZW50cnlQb2ludE1hbmlmZXN0OiBFbnRyeVBvaW50TWFuaWZlc3QsIGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCxcbiAgICBhYnNvbHV0ZVRhcmdldEVudHJ5UG9pbnRQYXRoOiBBYnNvbHV0ZUZzUGF0aHxudWxsLCBwYXRoTWFwcGluZ3M6IFBhdGhNYXBwaW5nc3x1bmRlZmluZWQsXG4gICAgdHNDb25maWc6IFBhcnNlZENvbmZpZ3VyYXRpb258bnVsbCwgcHJvamVjdFBhdGg6IEFic29sdXRlRnNQYXRoKTogRW50cnlQb2ludEZpbmRlciB7XG4gIGlmIChhYnNvbHV0ZVRhcmdldEVudHJ5UG9pbnRQYXRoICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBUYXJnZXRlZEVudHJ5UG9pbnRGaW5kZXIoXG4gICAgICAgIGZzLCBjb25maWcsIGxvZ2dlciwgcmVzb2x2ZXIsIGJhc2VQYXRoLCBwYXRoTWFwcGluZ3MsIGFic29sdXRlVGFyZ2V0RW50cnlQb2ludFBhdGgpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGVudHJ5UG9pbnRDb2xsZWN0b3IgPSBuZXcgRW50cnlQb2ludENvbGxlY3RvcihmcywgY29uZmlnLCBsb2dnZXIsIHJlc29sdmVyKTtcbiAgICBpZiAodHNDb25maWcgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvZ3JhbUJhc2VkRW50cnlQb2ludEZpbmRlcihcbiAgICAgICAgICBmcywgY29uZmlnLCBsb2dnZXIsIHJlc29sdmVyLCBlbnRyeVBvaW50Q29sbGVjdG9yLCBlbnRyeVBvaW50TWFuaWZlc3QsIGJhc2VQYXRoLCB0c0NvbmZpZyxcbiAgICAgICAgICBwcm9qZWN0UGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgRGlyZWN0b3J5V2Fsa2VyRW50cnlQb2ludEZpbmRlcihcbiAgICAgICAgICBsb2dnZXIsIHJlc29sdmVyLCBlbnRyeVBvaW50Q29sbGVjdG9yLCBlbnRyeVBvaW50TWFuaWZlc3QsIGJhc2VQYXRoLCBwYXRoTWFwcGluZ3MpO1xuICAgIH1cbiAgfVxufVxuIl19