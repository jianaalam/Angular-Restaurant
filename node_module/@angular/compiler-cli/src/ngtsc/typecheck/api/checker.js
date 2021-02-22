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
        define("@angular/compiler-cli/src/ngtsc/typecheck/api/checker", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OptimizeFor = void 0;
    /**
     * Describes the scope of the caller's interest in template type-checking results.
     */
    var OptimizeFor;
    (function (OptimizeFor) {
        /**
         * Indicates that a consumer of a `TemplateTypeChecker` is only interested in results for a given
         * file, and wants them as fast as possible.
         *
         * Calling `TemplateTypeChecker` methods successively for multiple files while specifying
         * `OptimizeFor.SingleFile` can result in significant unnecessary overhead overall.
         */
        OptimizeFor[OptimizeFor["SingleFile"] = 0] = "SingleFile";
        /**
         * Indicates that a consumer of a `TemplateTypeChecker` intends to query for results pertaining to
         * the entire user program, and so the type-checker should internally optimize for this case.
         *
         * Initial calls to retrieve type-checking information may take longer, but repeated calls to
         * gather information for the whole user program will be significantly faster with this mode of
         * optimization.
         */
        OptimizeFor[OptimizeFor["WholeProgram"] = 1] = "WholeProgram";
    })(OptimizeFor = exports.OptimizeFor || (exports.OptimizeFor = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdHlwZWNoZWNrL2FwaS9jaGVja2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQXVKSDs7T0FFRztJQUNILElBQVksV0FtQlg7SUFuQkQsV0FBWSxXQUFXO1FBQ3JCOzs7Ozs7V0FNRztRQUNILHlEQUFVLENBQUE7UUFFVjs7Ozs7OztXQU9HO1FBQ0gsNkRBQVksQ0FBQTtJQUNkLENBQUMsRUFuQlcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFtQnRCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QVNULCBNZXRob2RDYWxsLCBQYXJzZUVycm9yLCBQcm9wZXJ0eVJlYWQsIFNhZmVNZXRob2RDYWxsLCBTYWZlUHJvcGVydHlSZWFkLCBUbXBsQXN0RWxlbWVudCwgVG1wbEFzdE5vZGUsIFRtcGxBc3RUZW1wbGF0ZX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtGdWxsVGVtcGxhdGVNYXBwaW5nLCBUeXBlQ2hlY2thYmxlRGlyZWN0aXZlTWV0YX0gZnJvbSAnLi9hcGknO1xuaW1wb3J0IHtHbG9iYWxDb21wbGV0aW9ufSBmcm9tICcuL2NvbXBsZXRpb24nO1xuaW1wb3J0IHtEaXJlY3RpdmVJblNjb3BlLCBQaXBlSW5TY29wZX0gZnJvbSAnLi9zY29wZSc7XG5pbXBvcnQge0RpcmVjdGl2ZVN5bWJvbCwgRWxlbWVudFN5bWJvbCwgU2hpbUxvY2F0aW9uLCBTeW1ib2wsIFRlbXBsYXRlU3ltYm9sfSBmcm9tICcuL3N5bWJvbHMnO1xuXG4vKipcbiAqIEludGVyZmFjZSB0byB0aGUgQW5ndWxhciBUZW1wbGF0ZSBUeXBlIENoZWNrZXIgdG8gZXh0cmFjdCBkaWFnbm9zdGljcyBhbmQgaW50ZWxsaWdlbmNlIGZyb20gdGhlXG4gKiBjb21waWxlcidzIHVuZGVyc3RhbmRpbmcgb2YgY29tcG9uZW50IHRlbXBsYXRlcy5cbiAqXG4gKiBUaGlzIGludGVyZmFjZSBpcyBhbmFsb2dvdXMgdG8gVHlwZVNjcmlwdCdzIG93biBgdHMuVHlwZUNoZWNrZXJgIEFQSS5cbiAqXG4gKiBJbiBnZW5lcmFsLCB0aGlzIGludGVyZmFjZSBzdXBwb3J0cyB0d28ga2luZHMgb2Ygb3BlcmF0aW9uczpcbiAqICAtIHVwZGF0aW5nIFR5cGUgQ2hlY2sgQmxvY2tzIChUQ0IpcyB0aGF0IGNhcHR1cmUgdGhlIHRlbXBsYXRlIGluIHRoZSBmb3JtIG9mIFR5cGVTY3JpcHQgY29kZVxuICogIC0gcXVlcnlpbmcgaW5mb3JtYXRpb24gYWJvdXQgYXZhaWxhYmxlIFRDQnMsIGluY2x1ZGluZyBkaWFnbm9zdGljc1xuICpcbiAqIE9uY2UgYSBUQ0IgaXMgYXZhaWxhYmxlLCBpbmZvcm1hdGlvbiBhYm91dCBpdCBjYW4gYmUgcXVlcmllZC4gSWYgbm8gVENCIGlzIGF2YWlsYWJsZSB0byBhbnN3ZXIgYVxuICogcXVlcnksIGRlcGVuZGluZyBvbiB0aGUgbWV0aG9kIGVpdGhlciBgbnVsbGAgd2lsbCBiZSByZXR1cm5lZCBvciBhbiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZVR5cGVDaGVja2VyIHtcbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSB0ZW1wbGF0ZSBpbiB1c2UgZm9yIHRoZSBnaXZlbiBjb21wb25lbnQuXG4gICAqL1xuICBnZXRUZW1wbGF0ZShjb21wb25lbnQ6IHRzLkNsYXNzRGVjbGFyYXRpb24pOiBUbXBsQXN0Tm9kZVtdfG51bGw7XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgYHRzLkRpYWdub3N0aWNgcyBjdXJyZW50bHkgYXZhaWxhYmxlIGZvciB0aGUgZ2l2ZW4gYHRzLlNvdXJjZUZpbGVgLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIGZhaWwgKHRocm93KSBpZiB0aGVyZSBhcmUgY29tcG9uZW50cyB3aXRoaW4gdGhlIGB0cy5Tb3VyY2VGaWxlYCB0aGF0IGRvIG5vdFxuICAgKiBoYXZlIFRDQnMgYXZhaWxhYmxlLlxuICAgKlxuICAgKiBHZW5lcmF0aW5nIGEgdGVtcGxhdGUgdHlwZS1jaGVja2luZyBwcm9ncmFtIGlzIGV4cGVuc2l2ZSwgYW5kIGluIHNvbWUgd29ya2Zsb3dzIChlLmcuIGNoZWNraW5nXG4gICAqIGFuIGVudGlyZSBwcm9ncmFtIGJlZm9yZSBlbWl0KSwgaXQgc2hvdWxkIGlkZWFsbHkgb25seSBiZSBkb25lIG9uY2UuIFRoZSBgb3B0aW1pemVGb3JgIGZsYWdcbiAgICogYWxsb3dzIHRoZSBjYWxsZXIgdG8gaGludCB0byBgZ2V0RGlhZ25vc3RpY3NGb3JGaWxlYCAod2hpY2ggaW50ZXJuYWxseSB3aWxsIGNyZWF0ZSBhIHRlbXBsYXRlXG4gICAqIHR5cGUtY2hlY2tpbmcgcHJvZ3JhbSBpZiBuZWVkZWQpIHdoZXRoZXIgdGhlIGNhbGxlciBpcyBpbnRlcmVzdGVkIGluIGp1c3QgdGhlIHJlc3VsdHMgb2YgdGhlXG4gICAqIHNpbmdsZSBmaWxlLCBvciB3aGV0aGVyIHRoZXkgcGxhbiB0byBxdWVyeSBhYm91dCBvdGhlciBmaWxlcyBpbiB0aGUgcHJvZ3JhbS4gQmFzZWQgb24gdGhpc1xuICAgKiBmbGFnLCBgZ2V0RGlhZ25vc3RpY3NGb3JGaWxlYCB3aWxsIGRldGVybWluZSBob3cgbXVjaCBvZiB0aGUgdXNlcidzIHByb2dyYW0gdG8gcHJlcGFyZSBmb3JcbiAgICogY2hlY2tpbmcgYXMgcGFydCBvZiB0aGUgdGVtcGxhdGUgdHlwZS1jaGVja2luZyBwcm9ncmFtIGl0IGNyZWF0ZXMuXG4gICAqL1xuICBnZXREaWFnbm9zdGljc0ZvckZpbGUoc2Y6IHRzLlNvdXJjZUZpbGUsIG9wdGltaXplRm9yOiBPcHRpbWl6ZUZvcik6IHRzLkRpYWdub3N0aWNbXTtcblxuICAvKipcbiAgICogR2l2ZW4gYSBgc2hpbWAgYW5kIHBvc2l0aW9uIHdpdGhpbiB0aGUgZmlsZSwgcmV0dXJucyBpbmZvcm1hdGlvbiBmb3IgbWFwcGluZyBiYWNrIHRvIGEgdGVtcGxhdGVcbiAgICogbG9jYXRpb24uXG4gICAqL1xuICBnZXRUZW1wbGF0ZU1hcHBpbmdBdFNoaW1Mb2NhdGlvbihzaGltTG9jYXRpb246IFNoaW1Mb2NhdGlvbik6IEZ1bGxUZW1wbGF0ZU1hcHBpbmd8bnVsbDtcblxuICAvKipcbiAgICogR2V0IGFsbCBgdHMuRGlhZ25vc3RpY2BzIGN1cnJlbnRseSBhdmFpbGFibGUgdGhhdCBwZXJ0YWluIHRvIHRoZSBnaXZlbiBjb21wb25lbnQuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGFsd2F5cyBydW5zIGluIGBPcHRpbWl6ZUZvci5TaW5nbGVGaWxlYCBtb2RlLlxuICAgKi9cbiAgZ2V0RGlhZ25vc3RpY3NGb3JDb21wb25lbnQoY29tcG9uZW50OiB0cy5DbGFzc0RlY2xhcmF0aW9uKTogdHMuRGlhZ25vc3RpY1tdO1xuXG4gIC8qKlxuICAgKiBFbnN1cmVzIHNoaW1zIGZvciB0aGUgd2hvbGUgcHJvZ3JhbSBhcmUgZ2VuZXJhdGVkLiBUaGlzIHR5cGUgb2Ygb3BlcmF0aW9uIHdvdWxkIGJlIHJlcXVpcmVkIGJ5XG4gICAqIG9wZXJhdGlvbnMgbGlrZSBcImZpbmQgcmVmZXJlbmNlc1wiIGFuZCBcInJlZmFjdG9yL3JlbmFtZVwiIGJlY2F1c2UgcmVmZXJlbmNlcyBtYXkgYXBwZWFyIGluIHR5cGVcbiAgICogY2hlY2sgYmxvY2tzIGdlbmVyYXRlZCBmcm9tIHRlbXBsYXRlcyBhbnl3aGVyZSBpbiB0aGUgcHJvZ3JhbS5cbiAgICovXG4gIGdlbmVyYXRlQWxsVHlwZUNoZWNrQmxvY2tzKCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBnaXZlbiBmaWxlIGlzIGluIHRoZSByZWNvcmQgb2Yga25vd24gc2hpbXMgZ2VuZXJhdGVkIGJ5IHRoZSBjb21waWxlcixcbiAgICogYGZhbHNlYCBpZiB3ZSBjYW5ub3QgZmluZCB0aGUgZmlsZSBpbiB0aGUgc2hpbSByZWNvcmRzLlxuICAgKi9cbiAgaXNUcmFja2VkVHlwZUNoZWNrRmlsZShmaWxlUGF0aDogQWJzb2x1dGVGc1BhdGgpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgdG9wLWxldmVsIG5vZGUgcmVwcmVzZW50aW5nIHRoZSBUQ0IgZm9yIHRoZSBnaXZlbiBjb21wb25lbnQuXG4gICAqXG4gICAqIFRoaXMgY2FuIHJldHVybiBgbnVsbGAgaWYgdGhlcmUgaXMgbm8gVENCIGF2YWlsYWJsZSBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgYWx3YXlzIHJ1bnMgaW4gYE9wdGltaXplRm9yLlNpbmdsZUZpbGVgIG1vZGUuXG4gICAqL1xuICBnZXRUeXBlQ2hlY2tCbG9jayhjb21wb25lbnQ6IHRzLkNsYXNzRGVjbGFyYXRpb24pOiB0cy5Ob2RlfG51bGw7XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyBhIGBTeW1ib2xgIGZvciB0aGUgbm9kZSBpbiBhIGNvbXBvbmVudCdzIHRlbXBsYXRlLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjYW4gcmV0dXJuIGBudWxsYCBpZiBhIHZhbGlkIGBTeW1ib2xgIGNhbm5vdCBiZSBkZXRlcm1pbmVkIGZvciB0aGUgbm9kZS5cbiAgICpcbiAgICogQHNlZSBTeW1ib2xcbiAgICovXG4gIGdldFN5bWJvbE9mTm9kZShub2RlOiBUbXBsQXN0RWxlbWVudCwgY29tcG9uZW50OiB0cy5DbGFzc0RlY2xhcmF0aW9uKTogRWxlbWVudFN5bWJvbHxudWxsO1xuICBnZXRTeW1ib2xPZk5vZGUobm9kZTogVG1wbEFzdFRlbXBsYXRlLCBjb21wb25lbnQ6IHRzLkNsYXNzRGVjbGFyYXRpb24pOiBUZW1wbGF0ZVN5bWJvbHxudWxsO1xuICBnZXRTeW1ib2xPZk5vZGUobm9kZTogQVNUfFRtcGxBc3ROb2RlLCBjb21wb25lbnQ6IHRzLkNsYXNzRGVjbGFyYXRpb24pOiBTeW1ib2x8bnVsbDtcblxuICAvKipcbiAgICogR2V0IFwiZ2xvYmFsXCIgYENvbXBsZXRpb25gcyBpbiB0aGUgZ2l2ZW4gY29udGV4dC5cbiAgICpcbiAgICogR2xvYmFsIGNvbXBsZXRpb25zIGFyZSBjb21wbGV0aW9ucyBpbiB0aGUgZ2xvYmFsIGNvbnRleHQsIGFzIG9wcG9zZWQgdG8gY29tcGxldGlvbnMgd2l0aGluIGFuXG4gICAqIGV4aXN0aW5nIGV4cHJlc3Npb24uIEZvciBleGFtcGxlLCBjb21wbGV0aW5nIGluc2lkZSBhIG5ldyBpbnRlcnBvbGF0aW9uIGV4cHJlc3Npb24gKGB7e3x9fWApIG9yXG4gICAqIGluc2lkZSBhIG5ldyBwcm9wZXJ0eSBiaW5kaW5nIGBbaW5wdXRdPVwifFwiIHNob3VsZCByZXRyaWV2ZSBnbG9iYWwgY29tcGxldGlvbnMsIHdoaWNoIHdpbGxcbiAgICogaW5jbHVkZSBjb21wbGV0aW9ucyBmcm9tIHRoZSB0ZW1wbGF0ZSdzIGNvbnRleHQgY29tcG9uZW50LCBhcyB3ZWxsIGFzIGFueSBsb2NhbCByZWZlcmVuY2VzIG9yXG4gICAqIHRlbXBsYXRlIHZhcmlhYmxlcyB3aGljaCBhcmUgaW4gc2NvcGUgZm9yIHRoYXQgZXhwcmVzc2lvbi5cbiAgICovXG4gIGdldEdsb2JhbENvbXBsZXRpb25zKGNvbnRleHQ6IFRtcGxBc3RUZW1wbGF0ZXxudWxsLCBjb21wb25lbnQ6IHRzLkNsYXNzRGVjbGFyYXRpb24pOlxuICAgICAgR2xvYmFsQ29tcGxldGlvbnxudWxsO1xuXG5cbiAgLyoqXG4gICAqIEZvciB0aGUgZ2l2ZW4gZXhwcmVzc2lvbiBub2RlLCByZXRyaWV2ZSBhIGBTaGltTG9jYXRpb25gIHRoYXQgY2FuIGJlIHVzZWQgdG8gcGVyZm9ybVxuICAgKiBhdXRvY29tcGxldGlvbiBhdCB0aGF0IHBvaW50IGluIHRoZSBleHByZXNzaW9uLCBpZiBzdWNoIGEgbG9jYXRpb24gZXhpc3RzLlxuICAgKi9cbiAgZ2V0RXhwcmVzc2lvbkNvbXBsZXRpb25Mb2NhdGlvbihcbiAgICAgIGV4cHI6IFByb3BlcnR5UmVhZHxTYWZlUHJvcGVydHlSZWFkfE1ldGhvZENhbGx8U2FmZU1ldGhvZENhbGwsXG4gICAgICBjb21wb25lbnQ6IHRzLkNsYXNzRGVjbGFyYXRpb24pOiBTaGltTG9jYXRpb258bnVsbDtcblxuICAvKipcbiAgICogR2V0IGJhc2ljIG1ldGFkYXRhIG9uIHRoZSBkaXJlY3RpdmVzIHdoaWNoIGFyZSBpbiBzY29wZSBmb3IgdGhlIGdpdmVuIGNvbXBvbmVudC5cbiAgICovXG4gIGdldERpcmVjdGl2ZXNJblNjb3BlKGNvbXBvbmVudDogdHMuQ2xhc3NEZWNsYXJhdGlvbik6IERpcmVjdGl2ZUluU2NvcGVbXXxudWxsO1xuXG4gIC8qKlxuICAgKiBHZXQgYmFzaWMgbWV0YWRhdGEgb24gdGhlIHBpcGVzIHdoaWNoIGFyZSBpbiBzY29wZSBmb3IgdGhlIGdpdmVuIGNvbXBvbmVudC5cbiAgICovXG4gIGdldFBpcGVzSW5TY29wZShjb21wb25lbnQ6IHRzLkNsYXNzRGVjbGFyYXRpb24pOiBQaXBlSW5TY29wZVtdfG51bGw7XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGEgYE1hcGAgb2YgcG90ZW50aWFsIHRlbXBsYXRlIGVsZW1lbnQgdGFncywgdG8gZWl0aGVyIHRoZSBgRGlyZWN0aXZlSW5TY29wZWAgdGhhdFxuICAgKiBkZWNsYXJlcyB0aGVtIChpZiB0aGUgdGFnIGlzIGZyb20gYSBkaXJlY3RpdmUvY29tcG9uZW50KSwgb3IgYG51bGxgIGlmIHRoZSB0YWcgb3JpZ2luYXRlcyBmcm9tXG4gICAqIHRoZSBET00gc2NoZW1hLlxuICAgKi9cbiAgZ2V0UG90ZW50aWFsRWxlbWVudFRhZ3MoY29tcG9uZW50OiB0cy5DbGFzc0RlY2xhcmF0aW9uKTogTWFwPHN0cmluZywgRGlyZWN0aXZlSW5TY29wZXxudWxsPjtcblxuICAvKipcbiAgICogUmV0cmlldmUgYW55IHBvdGVudGlhbCBET00gYmluZGluZ3MgZm9yIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgKlxuICAgKiBUaGlzIHJldHVybnMgYW4gYXJyYXkgb2Ygb2JqZWN0cyB3aGljaCBsaXN0IGJvdGggdGhlIGF0dHJpYnV0ZSBhbmQgcHJvcGVydHkgbmFtZXMgb2YgZWFjaFxuICAgKiBiaW5kaW5nLCB3aGljaCBhcmUgdXN1YWxseSBpZGVudGljYWwgYnV0IGNhbiB2YXJ5IGlmIHRoZSBIVE1MIGF0dHJpYnV0ZSBuYW1lIGlzIGZvciBleGFtcGxlIGFcbiAgICogcmVzZXJ2ZWQga2V5d29yZCBpbiBKUywgbGlrZSB0aGUgYGZvcmAgYXR0cmlidXRlIHdoaWNoIGNvcnJlc3BvbmRzIHRvIHRoZSBgaHRtbEZvcmAgcHJvcGVydHkuXG4gICAqL1xuICBnZXRQb3RlbnRpYWxEb21CaW5kaW5ncyh0YWdOYW1lOiBzdHJpbmcpOiB7YXR0cmlidXRlOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmd9W107XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSB0eXBlIGNoZWNraW5nIGVuZ2luZSdzIG1ldGFkYXRhIGZvciB0aGUgZ2l2ZW4gZGlyZWN0aXZlIGNsYXNzLCBpZiBhdmFpbGFibGUuXG4gICAqL1xuICBnZXREaXJlY3RpdmVNZXRhZGF0YShkaXI6IHRzLkNsYXNzRGVjbGFyYXRpb24pOiBUeXBlQ2hlY2thYmxlRGlyZWN0aXZlTWV0YXxudWxsO1xuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgYFRlbXBsYXRlVHlwZUNoZWNrZXJgJ3Mgc3RhdGUgZm9yIHRoZSBnaXZlbiBjbGFzcywgc28gdGhhdCBpdCB3aWxsIGJlIHJlY29tcHV0ZWQgb25cbiAgICogdGhlIG5leHQgcmVxdWVzdC5cbiAgICovXG4gIGludmFsaWRhdGVDbGFzcyhjbGF6ejogdHMuQ2xhc3NEZWNsYXJhdGlvbik6IHZvaWQ7XG59XG5cbi8qKlxuICogRGVzY3JpYmVzIHRoZSBzY29wZSBvZiB0aGUgY2FsbGVyJ3MgaW50ZXJlc3QgaW4gdGVtcGxhdGUgdHlwZS1jaGVja2luZyByZXN1bHRzLlxuICovXG5leHBvcnQgZW51bSBPcHRpbWl6ZUZvciB7XG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhhdCBhIGNvbnN1bWVyIG9mIGEgYFRlbXBsYXRlVHlwZUNoZWNrZXJgIGlzIG9ubHkgaW50ZXJlc3RlZCBpbiByZXN1bHRzIGZvciBhIGdpdmVuXG4gICAqIGZpbGUsIGFuZCB3YW50cyB0aGVtIGFzIGZhc3QgYXMgcG9zc2libGUuXG4gICAqXG4gICAqIENhbGxpbmcgYFRlbXBsYXRlVHlwZUNoZWNrZXJgIG1ldGhvZHMgc3VjY2Vzc2l2ZWx5IGZvciBtdWx0aXBsZSBmaWxlcyB3aGlsZSBzcGVjaWZ5aW5nXG4gICAqIGBPcHRpbWl6ZUZvci5TaW5nbGVGaWxlYCBjYW4gcmVzdWx0IGluIHNpZ25pZmljYW50IHVubmVjZXNzYXJ5IG92ZXJoZWFkIG92ZXJhbGwuXG4gICAqL1xuICBTaW5nbGVGaWxlLFxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhhdCBhIGNvbnN1bWVyIG9mIGEgYFRlbXBsYXRlVHlwZUNoZWNrZXJgIGludGVuZHMgdG8gcXVlcnkgZm9yIHJlc3VsdHMgcGVydGFpbmluZyB0b1xuICAgKiB0aGUgZW50aXJlIHVzZXIgcHJvZ3JhbSwgYW5kIHNvIHRoZSB0eXBlLWNoZWNrZXIgc2hvdWxkIGludGVybmFsbHkgb3B0aW1pemUgZm9yIHRoaXMgY2FzZS5cbiAgICpcbiAgICogSW5pdGlhbCBjYWxscyB0byByZXRyaWV2ZSB0eXBlLWNoZWNraW5nIGluZm9ybWF0aW9uIG1heSB0YWtlIGxvbmdlciwgYnV0IHJlcGVhdGVkIGNhbGxzIHRvXG4gICAqIGdhdGhlciBpbmZvcm1hdGlvbiBmb3IgdGhlIHdob2xlIHVzZXIgcHJvZ3JhbSB3aWxsIGJlIHNpZ25pZmljYW50bHkgZmFzdGVyIHdpdGggdGhpcyBtb2RlIG9mXG4gICAqIG9wdGltaXphdGlvbi5cbiAgICovXG4gIFdob2xlUHJvZ3JhbSxcbn1cbiJdfQ==